import { createContext, useContext, ReactNode } from "react";
import { useCustomFirebase } from "@/hooks";
import { Task, TaskBeingEdited, User } from "@/types";

interface TaskBoardContextType {
  userId: string;
  tasks: Array<Task>;
  connectedUsers: Record<string, User>;
  tasksBeignEdited: Record<number, TaskBeingEdited>;
  createTask: (columnId: string) => void;
  deleteTask: (id: number) => void;
  updateTask: (id: number, content: string) => void;
}

const TaskBoardContext = createContext<TaskBoardContextType | null>(null);

export function TaskBoardProvider({ children }: { children: ReactNode }) {
  const customFirebaseData = useCustomFirebase();

  return (
    <TaskBoardContext.Provider value={customFirebaseData}>
      {children}
    </TaskBoardContext.Provider>
  );
}

export function useTaskBoard() {
  const context = useContext(TaskBoardContext);
  if (!context) {
    throw new Error("useTaskBoard must be used within a TaskBoardProvider");
  }
  return context;
}
