const { z } = require("zod");

const createFlightSchema = z
  .object({
    flightNumber: z.string().min(2).max(20),

    from: z.string().length(3),

    to: z.string().length(3),

    departureTime: z.string().datetime(),

    arrivalTime: z.string().datetime(),

    price: z.number().positive()
  })
  .refine(
    (data) => data.from !== data.to,
    {
      message: "Origin and destination cannot be the same",
      path: ["to"]
    }
  );