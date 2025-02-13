import { z } from "zod";

// export enum Role {
//   "provider" = "provider",
//   "client" = "client",
// }
export enum UserStatus {
  "active" = "active",
  "inactive" = "inactive",
}

export const UserSchema = z.object({
  id: z.string(),

  profilePic: z.string().or(z.literal("")).optional(),

  wallet: z.string().or(z.literal("")).optional(),

  xHandle: z.string().or(z.literal("")).optional(),

  followers: z.number().optional(),

  pnl: z.number().optional(),

  userName: z.string({}).trim().min(5),

  phone: z.string({}).trim().min(8),

  email: z.string({}).email().trim().or(z.literal("")).optional(),

  location: z.string({}).trim().or(z.literal("")).optional(),

  status: z.nativeEnum(UserStatus, {}),

  otherInformation: z.string({}).trim().or(z.literal("")).optional(),

  rtn: z.string({}).trim().or(z.literal("")).optional(),

  image: z.string().or(z.literal("")).optional(),

  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});