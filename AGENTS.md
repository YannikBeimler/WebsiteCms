# AI Agent Instructions

Welcome to the project! This document explains how to interact with this project.

1. This project is an Angular application with a Firebase backend.
2. We use a Dev Container setup (`.devcontainer/devcontainer.json`) for consistency.
3. Firebase Emulators are used for local development, configured in `firebase.json`. They must be started separately via `npm run emulators` before running `npm run start` or `npm run test`.
4. Continuous Integration is managed via GitHub Actions `.github/workflows`. Secrets should be injected correctly before the build.

## Documentation & Architecture

Further important information regarding the architecture, project structure, and setup can be found in the documentation:
- **[Main Documentation (Index)](docs/_index.md)**
- **[Architecture & Project Structure](docs/architecture.md)**

### Key Architectural Concepts:
- **Technology Stack:** Angular 17 (Standalone Components) with Firebase (Firestore, Auth, Storage).
- **Multi-Tenant System:** The CMS decides which Site and corresponding Pages to load based on the current URL (`window.location.hostname`).
- **Page Structure:** Each page can define its own layout options and recursively embed subpages (Child Pages).
- **Project Structure (`src/app`):**
  - `components/`: Contains standalone components like `shell` (main layout & routing), `page-view` (recursive rendering of CMS pages), `edit-dialogs`, and `login`.
  - `services/`: Contains core logic, e.g., `cms.service.ts` for current Site/Page state, `auth.service.ts` for Firebase Auth, and CRUD services for Sites and Pages.
  - `models/`: Interfaces for data schemas.
- **State Management:** Reactive paradigm (RxJS) utilizing `BehaviorSubject` and `Observable` in services, consumed via the `async` pipe.

Always follow best practices and validate your changes!
