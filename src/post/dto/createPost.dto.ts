import { z } from "zod";

export const CreatePostSchema = z.object({
  content: z.string().min(1, "Caption is required"),
});

export type CreatePostDto = z.infer<typeof CreatePostSchema>;
