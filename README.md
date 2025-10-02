This repository contains the **frontend application** for Core Gym Club AB, developed as part of a school assignment at EC Utbildning (ASP.NET Developer Program, WIN24).  
The project demonstrates modern frontend development practices with React, integration against multiple microservices, and role-based functionality.

---

## Overview

The frontend provides:

- User-facing portal for gym members to view and book training sessions.
- Trainer functionality for creating and managing sessions.
- Integration with multiple backend microservices (Events, Venues, Bookings, Authentication, Notifications).
- A modular React component structure with reusable modals, forms, and API client utilities.

---

## Features

- **Authentication** via JWT (Auth API).
- **Role-based UI** (trainers can create sessions, members can only book).
- **Session listing** with date filtering and availability tracking.
- **Session creation modal** with validation and API integration.
- **Reusable API client** with token handling, retries, and error states.
- **Custom modal system** (no Bootstrap/jQuery dependencies).
- **Environment-based configuration** via `.env` and Vite.

---

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Custom CSS (modularized, variables-based)
- **State & Hooks**: React hooks (`useState`, `useEffect`, `useMemo`)
- **API Calls**: Fetch wrapper with retries and token injection
- **Spinner/Loading**: `react-spinners`

---

## Microservices Integration

The frontend communicates with the following backend services:

- **EventService**
  - Create, edit, delete, list training sessions
- **VenueService**
  - Locations and rooms for training sessions
- **BookingService**
  - Booking sessions and managing participants
- **AuthService**
  - Login, token management, roles
- **NotificationService**
  - Email confirmation for bookings

All API base URLs are configurable in `.env`:

```env
VITE_EVENTS_API_BASE_URL=...
VITE_VENUES_API_BASE_URL=...
VITE_AUTH_API_BASE_URL=...
VITE_BOOKINGS_API_BASE_URL=...
VITE_NOTIFICATIONS_API_BASE_URL=...

Getting Started
Prerequisites

    Node.js 20+

    NPM 9+

Installation

git clone https://github.com/your-org/frontend.git
cd frontend
npm install

Development

npm run dev

The app will start at http://localhost:5173.
Build for Production

npm run build

Project Status

This is a school assignment developed by students at EC Utbildning.
It is not intended for production use but demonstrates microservice-based frontend integration.
