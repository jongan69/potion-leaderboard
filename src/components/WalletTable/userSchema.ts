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

  status: z.nativeEnum(UserStatus, {}),
  
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});