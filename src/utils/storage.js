import { DEFAULT_STUDENTS } from './mockData';

// Constants
const STORAGE_KEYS = {
  STUDENTS: 'student_portfolio_students',
  USERS: 'student_portfolio_users',
  SESSION: 'student_portfolio_session'
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
      if (idsToPurge.includes(sessionData.studentId)) {
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
export const getStudents = () => {
  const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  return data ? JSON.parse(data) : [];
};

// Retrieve a single student profile by ID
export const getStudentById = (id) => {
  const students = getStudents();
  return students.find(s => s.id === id) || null;
};

// Authentication: Get Active Session User
export const getCurrentSession = () => {
  const session = localStorage.getItem(STORAGE_KEYS.SESSION);
  if (!session) return null;
  
  try {
    const sessionData = JSON.parse(session);
    // Fetch fresh student profile data for this session
    const student = getStudentById(sessionData.studentId);
    return {
      ...sessionData,
      student
    };
  } catch (e) {
    return null;
  }
};

// Authentication: Sign In
export const signIn = (email, password) => {
  const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
  const users = usersStr ? JSON.parse(usersStr) : [];
  
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    throw new Error('No account found with this email address.');
  }
  
  if (user.password !== password) {
    throw new Error('Incorrect password. Please try again.');
  }
  
  const student = getStudentById(user.studentId);
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
};

// Authentication: Sign Up / Register
export const signUp = (name, email, password) => {
  const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
  const users = usersStr ? JSON.parse(usersStr) : [];
  
  const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (emailExists) {
    throw new Error('An account with this email address already exists.');
  }
  
  // Create a stable student ID from the name (slug) + timestamp for uniqueness
  const cleanName = name.trim();
  const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const studentId = `${slug}-${Date.now().toString().slice(-4)}`;
  
  // Create Student Profile
  const newStudent = {
    id: studentId,
    name: cleanName,
    major: "Undeclared",
    avatarId: `avatar-${Math.floor(Math.random() * 8) + 1}`, // Pick a random avatar
    shortBio: "Welcome to my new student portfolio! Click edit to fill in details.",
    aboutMe: "I haven't written my bio yet. Stay tuned!",
    skills: [],
    email: email.toLowerCase(),
    isPublic: true,
    github: "",
    linkedin: "",
    website: "",
    photos: [],
    projects: []
  };
  
  const students = getStudents();
  students.push(newStudent);
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  
  // Create User Credentials
  const newUser = {
    email: email.toLowerCase(),
    password,
    studentId,
    isAdmin: false
  };
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  
  // Set Active Session
  const sessionData = {
    email: newUser.email,
    studentId,
    isAdmin: false
  };
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
  
  return {
    user: sessionData,
    student: newStudent
  };
};

// Authentication: Sign Out
export const signOut = () => {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
};

// Mutate: Update Student Profile details
export const updateStudentProfile = (studentId, updatedFields) => {
  const students = getStudents();
  const index = students.findIndex(s => s.id === studentId);
  
  if (index === -1) {
    throw new Error('Student profile not found.');
  }
  
  // Merge profile updates, ensuring stable fields
  students[index] = {
    ...students[index],
    ...updatedFields,
    id: studentId, // Prevent modifying the ID
    email: students[index].email // Email is tied to user account email
  };
  
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  return students[index];
};

// Mutate: Delete student profile and associated account credentials
export const deleteStudentProfileAndAccount = (studentId) => {
  // 1. Remove student profile
  const students = getStudents();
  const filteredStudents = students.filter(s => s.id !== studentId);
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(filteredStudents));

  // 2. Remove user credentials
  const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
  const users = usersStr ? JSON.parse(usersStr) : [];
  const filteredUsers = users.filter(u => u.studentId !== studentId);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filteredUsers));

  // 3. Clear session if deleted account is the active session user
  const session = localStorage.getItem(STORAGE_KEYS.SESSION);
  if (session) {
    try {
      const sessionData = JSON.parse(session);
      if (sessionData.studentId === studentId) {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
      }
    } catch (e) {
      // ignore
    }
  }
};

// Mutate: Update user email in credentials and student profile
export const updateUserEmail = (studentId, newEmail) => {
  const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
  const users = usersStr ? JSON.parse(usersStr) : [];
  
  const cleanEmail = newEmail.trim().toLowerCase();
  
  // Check if another user is already using this email
  const emailExists = users.some(u => u.studentId !== studentId && u.email.toLowerCase() === cleanEmail);
  if (emailExists) {
    throw new Error('An account with this email address already exists.');
  }
  
  // 1. Update user credentials email
  const userIndex = users.findIndex(u => u.studentId === studentId);
  if (userIndex === -1) {
    throw new Error('User credentials record not found.');
  }
  users[userIndex].email = cleanEmail;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  
  // 2. Update student profile email
  const students = getStudents();
  const studentIndex = students.findIndex(s => s.id === studentId);
  if (studentIndex !== -1) {
    students[studentIndex].email = cleanEmail;
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }
  
  // 3. Update active session email if matches
  const session = localStorage.getItem(STORAGE_KEYS.SESSION);
  if (session) {
    try {
      const sessionData = JSON.parse(session);
      if (sessionData.studentId === studentId) {
        sessionData.email = cleanEmail;
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
      }
    } catch (e) {
      // ignore
    }
  }
};

// Mutate: Update user password
export const updateUserPassword = (studentId, currentPassword, newPassword) => {
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
};

// Mutate: Reset user password by email (Forgot Password flow)
export const resetUserPasswordByEmail = (email, newPassword) => {
  const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
  const users = usersStr ? JSON.parse(usersStr) : [];
  
  const cleanEmail = email.trim().toLowerCase();
  const index = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
  if (index === -1) {
    throw new Error('No account found with this email address.');
  }
  
  users[index].password = newPassword;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};
