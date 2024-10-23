import { fireEvent, render, screen } from "@testing-library/react";
import BoardView from "../src/components/Board/BoardView";
import { useTaskBoard } from "../src/context/TaskBoardProvider";

const mockConnectedUsers = {
  user1: { id: "user1" },
  user2: { id: "user2" },
  user3: { id: "user3" },
};

const mockTasks = [
  { id: "1", columnId: "todo", content: "Task 1" },
  { id: "2", columnId: "todo", content: "Task 2" },
];

const updatedMockTasks = [
  { id: "3", columnId: "todo", content: "Task 3" },
  { id: "2", columnId: "todo", content: "Task 2" },
  { id: "1", columnId: "todo", content: "Task 1" },
];

describe("BoardView Component", () => {
  const mockTaskBoardData = {
    userId: "user1",
    tasks: mockTasks,
    connectedUsers: mockConnectedUsers,
    tasksBeignEdited: {},
    updateTask: jest.fn(),
  };

  beforeEach(() => {
    (useTaskBoard as jest.Mock).mockReturnValue(mockTaskBoardData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders UserList and ColumnsView correctly", () => {
    render(<BoardView />);

    expect(screen.getByText(/connected users/i)).toBeInTheDocument();

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  test("initializes with correct task data from context", () => {
    render(<BoardView />);

    const tasks = screen.getAllByText(/Task \d/i);
    expect(tasks).toHaveLength(2);
  });

  test("does not crash when no tasks are present", () => {
    (useTaskBoard as jest.Mock).mockReturnValue({
      userId: "user1",
      tasks: [],
      connectedUsers: mockConnectedUsers,
      tasksBeignEdited: {},
    });

    render(<BoardView />);

    expect(screen.queryByText(/Task \d/i)).not.toBeInTheDocument();
  });

  test("renders tasks and allows editing in TaskItem from BoardView", () => {
    render(<BoardView />);

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Task 1"));

    const textarea = screen.getByPlaceholderText("Task content here");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue("Task 1");

    fireEvent.change(textarea, { target: { value: "Updated Task 1" } });

    expect(useTaskBoard().updateTask).toHaveBeenCalledWith(
      "1",
      "Updated Task 1"
    );
  });

  test("does not allow editing when another user is editing the same task", () => {
    (useTaskBoard as jest.Mock).mockReturnValue({
      ...mockTaskBoardData,
      tasksBeignEdited: { 1: { userId: "user2", taskId: 1 } },
    });

    render(<BoardView />);

    fireEvent.click(screen.getByText("Task 1"));

    expect(
      screen.queryByPlaceholderText("Task content here")
    ).not.toBeInTheDocument();
    expect(screen.getByText("user2 is editing")).toBeInTheDocument();
  });

  test("renders tasks in initial order and updates to new order", () => {
    const { rerender } = render(<BoardView />);

    let tasks = screen.getAllByText(/Task \d/i);
    expect(tasks).toHaveLength(2);
    expect(tasks[0]).toHaveTextContent("Task 1");
    expect(tasks[1]).toHaveTextContent("Task 2");

    (useTaskBoard as jest.Mock).mockReturnValue({
      ...mockTaskBoardData,
      tasks: updatedMockTasks,
    });

    rerender(<BoardView />);

    tasks = screen.getAllByText(/Task \d/i);
    expect(tasks).toHaveLength(3);
    expect(tasks[0]).toHaveTextContent("Task 3");
    expect(tasks[2]).toHaveTextContent("Task 1");
  });
});
