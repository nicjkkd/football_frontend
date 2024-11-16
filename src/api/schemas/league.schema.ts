import { League } from "../generated/zod";
import { z } from "zod";

// export const CreateLeagueSchema = z.object({
//   leagueName: z
//     .string()
//     .min(2, { message: "Field must contain more than 2 characters" })
//     .max(100, { message: "Field must contain less than 100 characters" }),
// });

export const CreateLeagueSchema = z.object({
  leagueName: z
    .string()
    .min(2, { message: "Field must contain more than 2 characters" })
    .max(100, { message: "Field must contain less than 100 characters" }),
  teamIdToAdd: z.coerce
    .string()
    .min(2, { message: "Field must contain more than 2 characters" })
    .max(100, { message: "Field must contain less than 100 characters" })
    .optional(),
});

export type CreateLeague = z.infer<typeof CreateLeagueSchema>;

export const FinalCreateLeagueSchema = z.object({
  teamsIdToAdd: z.array(z.string()).optional(),
  league: CreateLeagueSchema,
});

export type FinalCreateLeague = z.infer<typeof FinalCreateLeagueSchema>;

export type { League };
