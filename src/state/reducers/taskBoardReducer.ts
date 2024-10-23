import { Task, TaskBeingEdited, User } from "@/types";

export type State = {
  tasks: Task[];
  connectedUsers: Record<string, User>;
  tasksBeignEdited: Record<number, TaskBeingEdited>;
};

type Action =
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "SET_CONNECTED_USERS"; payload: Record<string, User> }
  | { type: "SET_TASKS_BEING_EDITED"; payload: Record<number, TaskBeingEdited> }
  | { type: "CREATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: number }
  | { type: "UPDATE_TASK"; payload: { id: number; content: string } };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_TASKS":
      return { ...state, tasks: action.payload };
    case "SET_CONNECTED_USERS":
      return { ...state, connectedUsers: action.payload };
    case "SET_TASKS_BEING_EDITED":
      return { ...state, tasksBeignEdited: action.payload };
    case "CREATE_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, content: action.payload.content }
            : task
        ),
      };
    default:
      return state;
  }
}
