Core Gym Club – Frontend
Overview
This repository contains the frontend application for Core Gym Club AB’s digital platform.
The goal is to provide members and staff with a modern, responsive interface for booking and managing training sessions, viewing availability, and handling authentication.
The application is built with React (Vite) and integrates with several backend microservices via REST APIs.

Features
Authentication & Authorization
Login and registration with JWT-based authentication.
Role-based access: Instructor vs. Customer.
Secure token storage in localStorage.
Session Management
Display of all available training sessions.
Date range filter for sessions.
Detailed session view.
Instructor-only functionality: create new sessions.
Create Session Modal
Instructors can create new training sessions directly in the UI.
Dynamic fetching of locations and rooms from VenueService.
Validation both client-side and server-side.
Role-gated: only visible for users with the Instructor role.
Session Availability
Shows current number of participants against room capacity.
Integrates with BookingService (participants) and VenueService (room info).
Reusable Components
LoginModal and RegisterModal with validation and error handling.
Terms of Use component with external link.
Reusable session cards and buttons.

Tech Stack
Framework: React 18 (Vite)
Routing: React Router
Styling: Custom CSS, utility classes
State Management: React hooks (useState, useEffect, useMemo)
APIs:
AuthService – authentication & registration


EventService – training sessions (CRUD)


VenueService – locations and rooms


BookingService – session bookings & participants


NotificationService – booking confirmations

Main Dependencies
These are the primary npm packages used in the project:
react / react-dom – core framework and rendering.
react-router-dom – routing between pages.
react-spinners – loader components (e.g. ClipLoader).
uuid – generation and validation of unique IDs.
vite – development/build tool.
prop-types – runtime props validation for components.
(See package.json for the full list of dependencies and devDependencies.)

Environment Variables
Configuration is handled via .env with the VITE_ prefix for client exposure.
# Event API
VITE_EVENTS_API_BASE_URL=https://eventsservices-xxxx.azurewebsites.net

# Venue API
VITE_VENUES_API_BASE_URL=https://venueservices-xxxx.azurewebsites.net

# Auth API
VITE_AUTH_API_BASE_URL=https://accountservice-xxxx.azurewebsites.net

# Booking API
VITE_BOOKINGS_API_BASE_URL=https://bookingservices-xxxx.azurewebsites.net

# Notification API
VITE_NOTIFICATIONS_API_BASE_URL=https://notificationservices-xxxx.azurewebsites.net

Getting Started
Prerequisites
Node.js 20+
npm or yarn
Installation
git clone https://github.com/your-org/frontend.git
cd frontend
npm install
Development
npm run dev
The app will start on http://localhost:5173.
Build
npm run build
Preview Production Build
npm run preview

Project Structure
src/
 ├─ components/       # Reusable UI components
 │   ├─ modals/       # Login, Register, CreateSession
 │   └─ SessionCard.jsx
 ├─ pages/            # Page-level views (SessionList, About, etc.)
 ├─ layouts/          # Shared layouts
 ├─ lib/              # API clients and utilities
 │   ├─ api.js
 │   └─ http.js
 ├─ App.jsx
 └─ main.jsx

Diagrams
Activity Diagram – Create Session (Instructor)
See docs/activity-diagram.md
Sequence Diagram – POST /api/Events
See docs/sequence-diagram.md

Contributing
Create a new branch from main:
git checkout main
git pull origin main
git checkout -b feature/your-feature
Make your changes.
Commit and push:
git add .
git commit -m "Description of your changes"
git push -u origin feature/your-feature
Open a Pull Request into main.


