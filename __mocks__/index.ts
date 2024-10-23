jest.mock("firebase/database", () => ({
  getDatabase: jest.fn(),
  ref: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

jest.mock("../src/context/TaskBoardProvider");
