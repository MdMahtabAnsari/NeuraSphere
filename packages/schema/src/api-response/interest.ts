import { z } from "zod";

export const InterestSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const UserInterestSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  interestId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  interest: InterestSchema
});

export const InterestDataSchema = z.object({
  interests: z.array(UserInterestSchema),
  totalPage: z.number(),
  currentPage: z.number()
});

export const InterestResponseSchema = z.object({
  message: z.string(),
  status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
  data: InterestDataSchema
});
