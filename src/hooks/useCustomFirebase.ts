import { useEffect, useMemo, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import { Task, TaskBeingEdited, User } from "@/types";
import {
  firebaseSet,
  firebaseRemove,
  firebaseOnValue,
  firebaseOnDisconnectRemove,
} from "@/services/firebaseService";
import { reducer, State } from "@/state/reducers/taskBoardReducer";

const initialState: State = {
  tasks: [],
  connectedUsers: {},
  tasksBeignEdited: {},
};

export default function useCustomFirebase() {
  const userId = useMemo(uuidv4, []); // Unique ID for each user session

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    firebaseOnValue("tasks", (snapshot) => {
      const data: Array<Task> | null = snapshot.val();
      dispatch({ type: "SET_TASKS", payload: data || [] });
    });

    firebaseOnValue("users", (snapshot) => {
      const data: Record<string, User> | null = snapshot.val();
      if (data) {
        dispatch({ type: "SET_CONNECTED_USERS", payload: data });
      }
    });

    firebaseSet(`users/${userId}`, { id: userId });
    firebaseOnDisconnectRemove(`users/${userId}`);

    firebaseOnValue("activeTasks", (snapshot) => {
      const data: Record<number, TaskBeingEdited> | null = snapshot.val();

      if (data) {
        const filteredActiveTasks = Object.values(data).filter(
          (elem) => elem.userId !== userId
        );
        if (filteredActiveTasks.length) {
          dispatch({
            type: "SET_TASKS_BEING_EDITED",
            payload: data,
          });
        }
        return;
      }
      dispatch({ type: "SET_TASKS_BEING_EDITED", payload: {} });
    });

    return () => {
      firebaseRemove(`users/${userId}`);
    };
  }, [userId]);

  async function createTask(columnId: string) {
    try {
      const newTask: Task = {
        id: Math.floor(Math.random() * 10001),
        columnId,
        content: `Task ${state.tasks.length + 1}`,
      };

      await firebaseSet("tasks", [...state.tasks, newTask]);
    } catch (error) {
      console.error("Failed to create task: ", error);
    }
  }

  async function deleteTask(id: number) {
    try {
      const newTasks = state.tasks.filter((task) => task.id !== id);
      await firebaseSet("tasks", newTasks);
    } catch (error) {
      console.error("Failed to delete task: ", error);
    }
  }

  async function updateTask(id: number, content: string) {
    try {
      const newTasks = state.tasks.map((task) => {
        if (task.id !== id) return task;
        return { ...task, content };
      });
      await firebaseSet("tasks", newTasks);
    } catch (error) {
      console.error("Failed to update task: ", error);
    }
  }

  return {
    userId,
    tasks: state.tasks,
    connectedUsers: state.connectedUsers,
    tasksBeignEdited: state.tasksBeignEdited,
    createTask,
    deleteTask,
    updateTask,
  };
}
