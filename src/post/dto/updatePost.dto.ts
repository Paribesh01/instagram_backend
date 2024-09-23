import { z } from "zod";
import { CreatePostSchema } from "./createpost.dto";

export const UpdatePostDtoSchema = CreatePostSchema.partial();

export type UpdatePostDto = z.infer<typeof UpdatePostDtoSchema>;
