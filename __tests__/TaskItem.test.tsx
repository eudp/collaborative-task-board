import { render, screen, fireEvent } from "@testing-library/react";
import TaskItem from "../src/components/Board/TaskItem";
import { useTaskBoard } from "../src/context/TaskBoardProvider";

const mockTask = { id: 1, content: "Test Task", columnId: "todo" };

describe("TaskItem Component", () => {
  let mockUpdateTask: jest.Mock;
  let mockDeleteTask: jest.Mock;

  beforeEach(() => {
    mockUpdateTask = jest.fn();
    mockDeleteTask = jest.fn();

    (useTaskBoard as jest.Mock).mockReturnValue({
      userId: "user123",
      updateTask: mockUpdateTask,
      deleteTask: mockDeleteTask,
      tasksBeignEdited: {},
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders task content", () => {
    render(<TaskItem task={mockTask} />);
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  test("enters edit mode on click", () => {
    render(<TaskItem task={mockTask} />);

    fireEvent.click(screen.getByText("Test Task"));
    const textarea = screen.getByPlaceholderText("Task content here");

    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue("Test Task");
  });

  test("calls updateTask on task content change", () => {
    render(<TaskItem task={mockTask} />);

    fireEvent.click(screen.getByText("Test Task"));
    const textarea = screen.getByPlaceholderText("Task content here");

    fireEvent.change(textarea, { target: { value: "Updated Task" } });

    expect(mockUpdateTask).toHaveBeenCalledWith(1, "Updated Task");
  });

  test("calls deleteTask on delete button click", () => {
    render(<TaskItem task={mockTask} />);

    fireEvent.mouseEnter(screen.getByText("Test Task"));
    const deleteButton = screen.getByTestId("delete-task-button");

    fireEvent.click(deleteButton);
    expect(mockDeleteTask).toHaveBeenCalledWith(1);
  });

  test("shows 'editing' indicator when another user is editing the task", () => {
    (useTaskBoard as jest.Mock).mockReturnValue({
      userId: "user123",
      tasksBeignEdited: { 1: { userId: "user2", taskId: 1 } },
    });

    render(<TaskItem task={mockTask} />);
    expect(screen.getByText("user2 is editing")).toBeInTheDocument();
  });

  test("disables editing if another user is editing", () => {
    (useTaskBoard as jest.Mock).mockReturnValue({
      userId: "user123",
      tasksBeignEdited: { 1: { userId: "user2", taskId: 1 } },
    });

    render(<TaskItem task={mockTask} />);
    fireEvent.click(screen.getByText("Test Task"));

    expect(
      screen.queryByPlaceholderText("Task content here")
    ).not.toBeInTheDocument();
  });
});
