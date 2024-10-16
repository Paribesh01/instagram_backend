import { z } from "zod";

const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"], {
  required_error: "Gender is required",
  invalid_type_error: "Gender must be either MALE, FEMALE, or OTHER",
});

const AccountTypeEnum = z.enum(["PUBLIC", "PRIVATE"], {
  required_error: "Account type is required",
  invalid_type_error: "Account type must be either PUBLIC or PRIVATE",
});

export const PreferencesSchema = z.object({
  bio: z.string()
    .max(500, { message: "Bio cannot exceed 500 characters" })
    .optional(),
  website: z.string()
    .url({ message: "Website must be a valid URL" })
    .optional(),
  gender: GenderEnum.default("MALE"),
  accountType: AccountTypeEnum.default("PUBLIC"),
});

// Type inference
export type PreferencesDto = z.infer<typeof PreferencesSchema>;
