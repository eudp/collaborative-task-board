import { render, screen, fireEvent } from "@testing-library/react";
import Column from "../src/components/Board/Column";
import { useTaskBoard } from "../src/context/TaskBoardProvider";

const mockColumn = { id: "todo", title: "Todo" };
const mockFilteredTasks = [
  { id: 1, columnId: "todo", content: "Task 1" },
  { id: 2, columnId: "todo", content: "Task 2" },
];

describe("Column Component", () => {
  let mockCreateTask: jest.Mock;

  beforeEach(() => {
    mockCreateTask = jest.fn();

    (useTaskBoard as jest.Mock).mockReturnValue({
      createTask: mockCreateTask,
      userId: "user123",
      tasksBeignEdited: {},
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders column with correct title and tasks", () => {
    render(<Column column={mockColumn} filteredTasks={mockFilteredTasks} />);

    expect(screen.getByText("Todo")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  test("'Add task' button works correctly", () => {
    render(<Column column={mockColumn} filteredTasks={mockFilteredTasks} />);

    const addTaskButton = screen.getByRole("button", { name: /add task/i });
    fireEvent.click(addTaskButton);

    expect(mockCreateTask).toHaveBeenCalledWith("todo");
  });
});
