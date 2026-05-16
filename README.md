# Website CMS

![Angular](https://img.shields.io/badge/Angular-17-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

An easy-to-use, in-place Content Management System (CMS) tailored for small websites. Built with Angular 17 and powered by Firebase, this application features a multi-tenant architecture to serve multiple sites from a single instance.

## Table of Contents

- [Features](#features)
- [Documentation](#documentation)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Architecture](#architecture)

## Features

- **Multi-Tenant Architecture**: Dynamically loads sites and pages based on the current hostname (`window.location.hostname`).
- **In-Place Editing**: Edit your content directly on the page for a seamless user experience.
- **Standalone Components**: Utilizes modern Angular 14+ standalone components.
- **Reactive State Management**: Heavy usage of RxJS (`BehaviorSubject`, `Observable`) for state handling.
- **Firebase Integration**: Leverages Firebase Firestore, Authentication, and Storage.

## Documentation

Comprehensive documentation can be found in the `/docs` directory:

- [Main Documentation Index](docs/_index.md)
- [Architecture & Project Structure](docs/architecture.md)
- [Setup & Guide](docs/setup.md)
- [User Manual](docs/user-manual.md)

*(For AI Agents: Please review [AGENTS.md](AGENTS.md) for automated workflows and project guidelines.)*

## Prerequisites

- **Node.js**: Ensure you have a compatible version of Node.js installed.
- **Dev Containers (Optional but Recommended)**: This project is configured to run within a Dev Container (`.devcontainer/devcontainer.json`) for a consistent development environment.
- **Firebase CLI**: Required for running emulators locally (`npm install -g firebase-tools`).

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd WebsiteCms
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Firebase Emulators:**
   Before running the application, start the local Firebase Emulators to ensure a safe sandbox environment.
   ```bash
   npm run emulators
   ```

4. **Run the Development Server:**
   In a separate terminal, start the Angular development server:
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Development Workflow

### Building for Production
Run `npm run build` (or `ng build`) to build the project. The build artifacts will be stored in the `dist/` directory.

### Running Tests
- **Unit Tests**: Run `npm test` (or `ng test`) to execute unit tests.
- **End-to-End Tests**: Run `ng e2e` (if configured).

### Scaffolding
Use the Angular CLI to generate new elements:
```bash
ng generate component components/my-new-component
```

## Architecture

The application is structured logically within the `src/app` directory following Angular best practices:
- `components/`: UI components (e.g., `shell`, `page-view`, `edit-dialogs`).
- `services/`: Business logic and Firebase interactions (`auth.service.ts`, `cms.service.ts`).
- `models/`: TypeScript interfaces for the data schema.

For an in-depth dive, refer to the [Architecture Documentation](docs/architecture.md).
