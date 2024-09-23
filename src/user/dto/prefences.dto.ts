import { z } from "zod";

const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
const AccountTypeEnum = z.enum(["PUBLIC", "PRIVATE"]);

const PreferencesSchema = z.object({
  id: z.string().uuid().optional(),
  bio: z.string().optional(),
  website: z.string().url().optional(),
  gender: GenderEnum.default("MALE"),
  accountType: AccountTypeEnum.default("PUBLIC"),
  userId: z.string().uuid(),
  imageUrl: z.string().url().optional(),
});
export type PrefencesDto = z.infer<typeof PreferencesSchema>;
