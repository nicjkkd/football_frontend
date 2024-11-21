import { z } from "zod";
import { Team } from "../generated/zod";

export const CreateTeamSchema = z.object({
  teamName: z
    .string()
    .min(2, { message: "Field must contain more than 2 characters" })
    .max(100, { message: "Field must contain less than 100 characters" }),
  city: z
    .string()
    .min(2, { message: "Field must contain more than 2 characters" })
    .max(100, { message: "Field must contain less than 100 characters" }),
  since: z.coerce
    .number()
    .int()
    .min(1000, { message: "Year must be greater than 1000" })
    .max(3000, { message: "Year must be less than 3000" }),
});

export type CreateTeam = z.infer<typeof CreateTeamSchema>;

export type { Team };