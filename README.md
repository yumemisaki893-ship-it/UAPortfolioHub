# OAD M-9 Web Design

A premium, state-of-the-art Student Portfolio Registry and Directory platform designed for the **University of Antique**. Built with a sleek, glassmorphic UI, modern layouts, dynamic client-side state persistence, and full administrator controls.

Live Demo: **[uaportfoliohub.vercel.app](https://uaportfoliohub.vercel.app)**

---

##  Key Features

### 1. Interactive Student Directory
- **Advanced Search & Filtering**: Real-time search across student names, bios, and specific tags. Filter by academic major.
- **Dynamic Sorting**: Sort students alphabetically (A-Z / Z-A) or by productivity metrics (Most Projects, Most Skills).
- **Interactive Statistics**: Live glassmorphic panel displays aggregated counts for *Active Portfolios*, *Projects Showcased*, and *Unique Skills* across all registered students.

### 2. Rich Profile Management
- **Detailed Bios & Customization**: Edit academic details, contact information (Github, LinkedIn, Personal Web), and tags.
- **Project Manager**: Add, edit, or remove project cards, linking directly to repositories or source files.
- **Live Image Previews**: Real-time circular preview of profile pictures and `21:9` ratio cover banner images in the editor before saving.

### 3. Institutional Integration (UA Branding)
- **Official Seal**: Branded headers, drawers, and favicon utilizing the official University of Antique logo.
- **Multi-language Mandates**: Instant translation toggling (English, Filipino, and Kinaray-a) for the university's mandate statement.
- **Goals & Objectives**: A clean, state-driven accordion presenting institutional goals and objectives with micro-animations.

### 4. Robust Account Security
- **Security Dashboard**: Easy-to-use forms for credential updates.
- **Email Validation**: Prevents duplicate email registration and updates across profiles and credentials.
- **Password Strength Rules**: Enforces complex password constraints (8+ characters, at least 1 uppercase, 1 number, and 1 special character).
- **Simulated OTP Recovery**: A verification code flow utilizing a 6-digit OTP to reset forgotten passwords.

### 5. Administrative Console (Admin Privileges)
- **Admin Authentication**: A special quick-login bypass link for `admin@university.edu`.
- **Private Profile Bypass**: Administrators can view private profiles marked invisible (`isPublic: false`) with a dedicated "Private" badge.
- **Global Actions**: Quick card-level profile deletions directly in the directory.
- **Double-Confirmation Workflows**: Secure two-step confirmations on all account deletions to prevent accidental loss.

---

## Tech Stack

- **Frontend Core**: React 18, JavaScript (ES6+), HTML5, Semantic Markup
- **Styling**: Vanilla CSS (Tailwind-free) utilizing custom HSL palettes, variables, glassmorphic backdrop-filters, and CSS variables.
- **Build Tool**: Vite & Oxc Compiler
- **State & Database**: Client-side localStorage persistence layer mimicking relational database operations (auto-cleanups, session management, unique constraint validation).

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yumemisaki893-ship-it/UAPortfolioHub.git
   cd UAPortfolioHub
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
