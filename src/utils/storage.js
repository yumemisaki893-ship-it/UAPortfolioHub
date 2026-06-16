import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  signInWithPopup, 
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where
} from 'firebase/firestore';
import { db, auth, googleProvider, isConfigured } from './firebase';
import { DEFAULT_STUDENTS } from './mockData';

// Constants for local fallback mode
const STORAGE_KEYS = {
  STUDENTS: 'student_portfolio_students',
  USERS: 'student_portfolio_users',
  SESSION: 'student_portfolio_session'
};

// Memory cache for student profiles to reduce read latency
let cachedStudentsList = null;
let lastFetchTime = 0;
const cachedStudentsMap = {};
const cachedStudentTimes = {};

const invalidateCache = (ids = []) => {
  cachedStudentsList = null;
  ids.forEach(id => {
    delete cachedStudentsMap[id];
    delete cachedStudentTimes[id];
  });
};

// Helper: Initialize Database if not already present
export const initStorage = () => {
  const idsToPurge = ['alice-vance', 'bob-chen', 'chloe-smith', 'david-kim'];

  // If storage already initialized, ensure we purge deleted default records if they exist.
  let students = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  if (!students) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
  } else {
    try {
      const parsedStudents = JSON.parse(students);
      if (parsedStudents.some(s => idsToPurge.includes(s.id))) {
        const filtered = parsedStudents.filter(s => !idsToPurge.includes(s.id));
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(filtered));
      }
    } catch (e) {
      // ignore
    }
  }
  
  let users = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!users) {
    // Generate mock user accounts mapping to the mock student profiles
    // Use matching password 'Password123!' for all mock accounts
    const mockUsers = DEFAULT_STUDENTS.map(student => ({
      email: student.email,
      password: 'Password123!',
      studentId: student.id,
      isAdmin: false
    }));
    
    // Add default admin user account
    mockUsers.push({
      email: 'admin@university.edu',
      password: 'Admin123!',
      studentId: 'admin-user',
      isAdmin: true
    });
    
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  } else {
    try {
      const parsedUsers = JSON.parse(users);
      if (parsedUsers.some(u => idsToPurge.includes(u.studentId))) {
        const filtered = parsedUsers.filter(u => !idsToPurge.includes(u.studentId));
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filtered));
      }
    } catch (e) {
      // ignore
    }
  }

  // Clear active session if it is logged in as one of the deleted users
  let session = localStorage.getItem(STORAGE_KEYS.SESSION);
  if (session) {
    try {
      const sessionData = JSON.parse(session);
      if (sessionData && idsToPurge.includes(sessionData.studentId)) {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
      }
    } catch (e) {
      // ignore
    }
  }
};

// Ensure DB is initialized immediately when the script is loaded
initStorage();

// Retrieve all students
export const getStudents = async (forceRefresh = false) => {
  if (!isConfigured) {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return data ? JSON.parse(data) : [];
  }
  
  const now = Date.now();
  if (cachedStudentsList && !forceRefresh && (now - lastFetchTime < 10000)) { // 10s TTL
    return cachedStudentsList;
  }
  
  try {
    const querySnapshot = await getDocs(collection(db, 'students'));
    const list = [];
    querySnapshot.forEach((doc) => {
      const studentData = { id: doc.id, ...doc.data() };
      list.push(studentData);
      cachedStudentsMap[doc.id] = studentData;
      cachedStudentTimes[doc.id] = now;
    });
    cachedStudentsList = list;
    lastFetchTime = now;
    return list;
  } catch (e) {
    console.error("Error loading students from Firestore: ", e);
    return [];
  }
};

// Retrieve a single student profile by ID synchronously if cached
export const getStudentByIdSync = (id) => {
  if (!id) return null;
  if (!isConfigured) {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!data) return null;
    try {
      const students = JSON.parse(data);
      return students.find(s => s.id === id) || null;
    } catch (e) {
      return null;
    }
  }
  return cachedStudentsMap[id] || null;
};

// Retrieve a single student profile by ID
export const getStudentById = async (id, forceRefresh = false) => {
  if (!isConfigured) {
    const students = await getStudents();
    return students.find(s => s.id === id) || null;
  }
  
  const now = Date.now();
  if (cachedStudentsMap[id] && !forceRefresh && (now - (cachedStudentTimes[id] || 0) < 10000)) { // 10s TTL
    return cachedStudentsMap[id];
  }
  
  try {
    const docRef = doc(db, 'students', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const studentData = { id: docSnap.id, ...docSnap.data() };
      cachedStudentsMap[id] = studentData;
      cachedStudentTimes[id] = now;
      return studentData;
    }
    return null;
  } catch (e) {
    console.error("Error getting student from Firestore: ", e);
    return null;
  }
};

// Helper: fetch user session document from Firestore
export const getSessionData = async (user) => {
  if (!user) return null;
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (userDoc.exists()) {
    return userDoc.data();
  }
  return null;
};

// Authentication: Get Active Session User (Sync/Local fallback, App.jsx uses onAuthStateChanged for firebase)
export const getCurrentSession = () => {
  if (isConfigured) return null; // App.jsx will handle Firebase auth listener

  const session = localStorage.getItem(STORAGE_KEYS.SESSION);
  if (!session) return null;
  
  try {
    const sessionData = JSON.parse(session);
    if (!sessionData) return null;
    // Since local storage is synchronous, we fetch local mock data
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    const students = data ? JSON.parse(data) : [];
    const student = students.find(s => s.id === sessionData.studentId) || null;
    return {
      ...sessionData,
      student
    };
  } catch (e) {
    return null;
  }
};

// Authentication: Sign In
export const signIn = async (email, password) => {
  const cleanEmail = email.trim().toLowerCase();

  if (!isConfigured) {
    const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
    const users = usersStr ? JSON.parse(usersStr) : [];
    
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      throw new Error('No account found with this email address.');
    }
    if (user.password !== password) {
      throw new Error('Incorrect password. Please try again.');
    }
    
    const student = await getStudentById(user.studentId);
    const sessionData = {
      email: user.email,
      studentId: user.studentId,
      isAdmin: !!user.isAdmin
    };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
    
    return {
      user: sessionData,
      student
    };
  }

  // Firebase auth with admin auto-provisioning
  if (cleanEmail === 'admin@university.edu' && password === 'Admin123!') {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      let sessionData = await getSessionData(userCredential.user);
      
      // Auto-provision admin user document in Firestore if it was cleared
      if (!sessionData) {
        sessionData = {
          email: cleanEmail,
          studentId: 'admin-user',
          isAdmin: true,
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', userCredential.user.uid), sessionData);
      }
      
      const student = await getStudentById(sessionData.studentId);
      return { user: sessionData, student };
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-email') {
        // Create admin user document dynamically if not found
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        const user = userCredential.user;
        const sessionData = {
          email: cleanEmail,
          studentId: 'admin-user',
          isAdmin: true,
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', user.uid), sessionData);
        return { user: sessionData, student: null };
      }
      throw err;
    }
  }

  const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
  const sessionData = await getSessionData(userCredential.user);
  if (!sessionData) {
    throw new Error('Account configurations not found in Cloud Database.');
  }
  const student = await getStudentById(sessionData.studentId);
  return {
    user: sessionData,
    student
  };
};

// Authentication: Sign Up / Register
export const signUp = async (name, email, password) => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();
  const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const studentId = `${slug}-${Date.now().toString().slice(-4)}`;
  
  const newStudent = {
    id: studentId,
    name: cleanName,
    major: "Undeclared",
    avatarId: `avatar-${Math.floor(Math.random() * 8) + 1}`,
    shortBio: "Welcome to my new student portfolio! Click edit to fill in details.",
    aboutMe: "I haven't written my bio yet. Stay tuned!",
    skills: [],
    email: cleanEmail,
    isPublic: true,
    github: "",
    linkedin: "",
    website: "",
    facebook: "",
    instagram: "",
    twitter: "",
    contactNumber: "",
    photos: [],
    projects: [],
    resume: null
  };

  if (!isConfigured) {
    const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
    const users = usersStr ? JSON.parse(usersStr) : [];
    
    const emailExists = users.some(u => u.email.toLowerCase() === cleanEmail);
    if (emailExists) {
      throw new Error('An account with this email address already exists.');
    }
    
    const students = await getStudents();
    students.push(newStudent);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    
    const newUser = {
      email: cleanEmail,
      password,
      studentId,
      isAdmin: false
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    const sessionData = {
      email: cleanEmail,
      studentId,
      isAdmin: false
    };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
    
    return {
      user: sessionData,
      student: newStudent
    };
  }

  // Create auth credentials
  const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
  const user = userCredential.user;

  // Save student document in Firestore
  await setDoc(doc(db, 'students', studentId), newStudent);

  // Save user document mapping in Firestore
  const sessionData = {
    email: cleanEmail,
    studentId,
    isAdmin: false,
    createdAt: new Date().toISOString()
  };
  await setDoc(doc(db, 'users', user.uid), sessionData);

  return {
    user: sessionData,
    student: newStudent
  };
};

// Google OAuth Sign In
export const signInWithGoogle = async () => {
  if (!isConfigured) {
    throw new Error('Google Sign-In is only available when Firebase is configured.');
  }

  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;
  
  let sessionData = await getSessionData(user);
  let student = null;

  if (!sessionData) {
    // Provision a new student profile and maps it to Google credentials
    const cleanName = user.displayName || 'Google Student';
    const cleanEmail = user.email || '';
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const studentId = `${slug}-${Date.now().toString().slice(-4)}`;

    student = {
      id: studentId,
      name: cleanName,
      major: "Undeclared",
      avatarId: `avatar-${Math.floor(Math.random() * 8) + 1}`,
      shortBio: "Welcome to my new student portfolio! Click edit to fill in details.",
      aboutMe: "I haven't written my bio yet. Stay tuned!",
      skills: [],
      email: cleanEmail,
      isPublic: true,
      github: "",
      linkedin: "",
      website: "",
      facebook: "",
      instagram: "",
      twitter: "",
      contactNumber: "",
      photos: [],
      projects: [],
      resume: null
    };

    await setDoc(doc(db, 'students', studentId), student);

    sessionData = {
      email: cleanEmail,
      studentId,
      isAdmin: false,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', user.uid), sessionData);
  } else {
    student = await getStudentById(sessionData.studentId);
  }

  return {
    user: sessionData,
    student
  };
};

// Authentication: Sign Out
export const signOut = async () => {
  if (!isConfigured) {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    return;
  }
  await firebaseSignOut(auth);
};

// Mutate: Update Student Profile details
export const updateStudentProfile = async (studentId, updatedFields) => {
  invalidateCache([studentId]);
  if (!isConfigured) {
    const students = await getStudents();
    const index = students.findIndex(s => s.id === studentId);
    
    if (index === -1) {
      throw new Error('Student profile not found.');
    }
    
    students[index] = {
      ...students[index],
      ...updatedFields,
      id: studentId,
      email: students[index].email
    };
    
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    return students[index];
  }

  const docRef = doc(db, 'students', studentId);
  const { id, email, ...safeFields } = updatedFields;
  await updateDoc(docRef, safeFields);
  const updatedDoc = await getDoc(docRef);
  return { id: studentId, ...updatedDoc.data() };
};

// Mutate: Delete student profile and associated account credentials
export const deleteStudentProfileAndAccount = async (studentId) => {
  invalidateCache([studentId]);
  if (!isConfigured) {
    const students = await getStudents();
    const filteredStudents = students.filter(s => s.id !== studentId);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(filteredStudents));

    const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
    const users = usersStr ? JSON.parse(usersStr) : [];
    const filteredUsers = users.filter(u => u.studentId !== studentId);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filteredUsers));

    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        if (sessionData.studentId === studentId) {
          localStorage.removeItem(STORAGE_KEYS.SESSION);
        }
      } catch (e) {}
    }
    return;
  }

  // 1. Delete student doc
  await deleteDoc(doc(db, 'students', studentId));

  const currentUser = auth.currentUser;

  // 2. Delete user credential document directly if it matches the current user's UID
  if (currentUser) {
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid));
    } catch (e) {
      console.warn("Could not delete own user document directly by UID:", e);
    }
  }

  // 3. Try to query matching studentId in users collection (Admin operations)
  try {
    const q = query(collection(db, 'users'), where('studentId', '==', studentId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
      // Avoid deleting twice if it's the current user (already deleted above)
      if (!currentUser || document.id !== currentUser.uid) {
        await deleteDoc(doc(db, 'users', document.id));
      }
    });
  } catch (err) {
    console.warn("Could not query users collection for deletion (expected for standard users):", err);
  }

  // 4. Delete Firebase Auth user account if it matches the profile
  if (currentUser) {
    try {
      await currentUser.delete();
    } catch (e) {
      console.warn("Could not delete Firebase Auth user account:", e);
    }
  }
};

// Mutate: Update user email in credentials and student profile
export const updateUserEmail = async (studentId, newEmail) => {
  const cleanEmail = newEmail.trim().toLowerCase();

  if (!isConfigured) {
    const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
    const users = usersStr ? JSON.parse(usersStr) : [];
    
    const emailExists = users.some(u => u.studentId !== studentId && u.email.toLowerCase() === cleanEmail);
    if (emailExists) {
      throw new Error('An account with this email address already exists.');
    }
    
    const userIndex = users.findIndex(u => u.studentId === studentId);
    if (userIndex === -1) {
      throw new Error('User credentials record not found.');
    }
    users[userIndex].email = cleanEmail;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    const students = await getStudents();
    const studentIndex = students.findIndex(s => s.id === studentId);
    if (studentIndex !== -1) {
      students[studentIndex].email = cleanEmail;
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    }
    
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        if (sessionData.studentId === studentId) {
          sessionData.email = cleanEmail;
          localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
        }
      } catch (e) {}
    }
    return;
  }

  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('No authenticated user session found.');
  }

  // Check unique constraint in Firestore
  const q = query(collection(db, 'users'), where('email', '==', cleanEmail));
  const querySnapshot = await getDocs(q);
  const existsOther = querySnapshot.docs.some(doc => doc.id !== currentUser.uid);
  if (existsOther) {
    throw new Error('An account with this email address already exists.');
  }

  // Update email credentials in Firebase Auth
  await firebaseUpdateEmail(currentUser, cleanEmail);

  // Update in Firestore
  await updateDoc(doc(db, 'users', currentUser.uid), { email: cleanEmail });
  await updateDoc(doc(db, 'students', studentId), { email: cleanEmail });
};

// Mutate: Update user password
export const updateUserPassword = async (studentId, currentPassword, newPassword) => {
  if (!isConfigured) {
    const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
    const users = usersStr ? JSON.parse(usersStr) : [];
    
    const index = users.findIndex(u => u.studentId === studentId);
    if (index === -1) {
      throw new Error('User credentials record not found.');
    }
    
    if (users[index].password !== currentPassword) {
      throw new Error('Incorrect current password.');
    }
    
    users[index].password = newPassword;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return;
  }

  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('No authenticated user session found.');
  }

  try {
    await firebaseUpdatePassword(currentUser, newPassword);
  } catch (err) {
    if (err.code === 'auth/requires-recent-login') {
      throw new Error('Recent login is required. Please sign out and sign back in to change your password.');
    }
    throw err;
  }
};

// Mutate: Reset user password by email (Forgot Password flow)
export const resetUserPasswordByEmail = async (email, newPassword) => {
  const cleanEmail = email.trim().toLowerCase();

  if (!isConfigured) {
    const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
    const users = usersStr ? JSON.parse(usersStr) : [];
    
    const index = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
    if (index === -1) {
      throw new Error('No account found with this email address.');
    }
    
    users[index].password = newPassword;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return;
  }

  // Firebase auth standard password recovery flow
  await sendPasswordResetEmail(auth, cleanEmail);
};


