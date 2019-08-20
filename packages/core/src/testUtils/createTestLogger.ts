import LoggerInterface from "../service/LoggerInterface";

function createTestLogger(): LoggerInterface {
  return {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  };
}

export default createTestLogger;
