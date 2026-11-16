jest.mock("../nats-wrapper");
jest.mock("../queues/expiration-queue", () => ({
  expirationQueue: {
    add: jest.fn().mockResolvedValue(undefined),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});
