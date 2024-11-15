import { League } from "../generated/zod";
import { z } from "zod";

export const CreateLeagueSchema = z.object({
  leagueName: z.string(),
});

export type CreateLeague = z.infer<typeof CreateLeagueSchema>;

export const FinalCreateLeagueSchema = z.object({
  teamsIdToAdd: z.array(z.string()).optional(),
  league: CreateLeagueSchema,
});

export type FinalCreateLeague = z.infer<typeof FinalCreateLeagueSchema>;

export type { League };
