# Aipan Arts E-commerce Platform

## Overview

This is a modern e-commerce platform for selling traditional Aipan art items like thaalis, loataas, diyaas, and other crafts from Uttarakhand. The application features a React-based frontend with TypeScript, Firebase for data storage and authentication, and focuses on showcasing traditional Indian craftsmanship with a culturally authentic design using red and white themes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite as the build tool
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Routing**: Wouter for client-side routing
- **State Management**: React Context API for authentication and cart management, TanStack Query for server state
- **Styling**: Tailwind CSS with custom CSS variables for theming, focused on traditional red/white color scheme

### Backend Architecture
- **Server**: Express.js with TypeScript running in development mode
- **API Strategy**: Serverless approach using Firebase directly from the client, with minimal Express server for static file serving
- **Database**: Firebase Firestore for all data persistence
- **Authentication**: Firebase Authentication with Google OAuth and email/password options

### Data Storage Solutions
- **Database**: Firebase Firestore with collections for:
  - Products (name, price, category, description, base64 images, stock)
  - Orders (user info, items, totals, status, timestamps)
  - Users (authentication profiles)
- **Image Storage**: Base64 encoded images stored directly in Firestore documents
- **Client Storage**: LocalStorage for cart persistence

### Authentication and Authorization
- **Firebase Authentication**: Google OAuth and email/password authentication
- **Admin Access**: Role-based access control with admin flag in user profiles
- **Session Management**: Firebase handles session management and token refresh automatically

### External Dependencies
- **Firebase Services**: 
  - Firebase Auth for user authentication
  - Firestore for database operations
  - Firebase hosting configuration ready
- **UI Components**: Extensive use of Radix UI primitives for accessibility
- **State Management**: TanStack React Query for API state management
- **Development Tools**: 
  - Vite for fast development and building
  - TypeScript for type safety
  - ESLint and build tools configured
- **Styling**: 
  - Tailwind CSS for utility-first styling
  - Custom fonts (Playfair Display, Inter) for traditional aesthetic
  - Geometric patterns and cultural design elements

The architecture prioritizes a modern, accessible user experience while maintaining cultural authenticity through design choices that reflect traditional Aipan art aesthetics.