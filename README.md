# Collaborative Task Board Application

A real-time collaborative task board application.

## Features

1. **Task Management:**
   - Create, edit, delete, and move tasks between the columns: "To Do", "In Progress", and "Done".
   - Real-time updates visible to all connected users when tasks are modified.
2. **User Presence:**
   - Display connected users and show who is editing or interacting with tasks in real-time.
3. **Concurrency Handling:**
   - Prevent multiple users from editing the same task simultaneously, providing visual feedback if a task is being edited by another user.

## Getting Started

Follow these steps to run the application locally:

### 1. Clone the repository:

```bash
git clone https://github.com/eudp/collaborative-task-board.git
```

### 2. Install dependencies:

```bash
cd collaborative-task-board
npm install
```

### 3. Set up Firebase:

Create a Firebase project and enable Firebase Realtime Database. Set the Firebase configuration in a `.env.local` file:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=<your-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-auth-domain>
NEXT_PUBLIC_FIREBASE_DATABASE_URL=<your-database-url>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your-storage-bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-messaging-sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<your-app-id>
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=<your-measurement-id>
```

### 4. Run the development server:

```bash
npm run dev
```

### 5. Open your browser:

The application will be available at `http://localhost:3000`.

## Testing

Unit and integration tests are included to ensure the application’s main functionality works as expected.

```bash
npm run test
```

## Tech Stack

- **React/Next.js**: For building the user interface.
- **Firebase Realtime Database**: For real-time data synchronization across users.
- **DndKit**: For drag-and-drop functionality.
- **TypeScript**: For static typing and improved code quality.
- **Tailwind CSS**: For rapid styling with a utility-first CSS framework.

## Folder Structure

The project follows a structured organization:

- `src/components`: Contains reusable UI components like `TaskItem`, `Column`, and `BoardView`.
- `src/context`: Context for managing the task board state.
- `src/hooks`: Custom hooks for task drag sensors and Firebase.
- `src/services`: Firebase services for data handling.
- `src/state:` Contains the application's state management logic.
- `src/types`: TypeScript types for tasks, users, and other entities.
- `src/utils`: Utility functions and constants.
- `tests`: Contains test files for unit and integration tests.
