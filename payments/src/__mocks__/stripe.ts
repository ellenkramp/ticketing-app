import mongoose from "mongoose";

export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: "asdfads" }),
  },
};
