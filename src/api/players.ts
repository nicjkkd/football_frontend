import { Player, PositionSchema } from "./generated/zod";
import { z } from "zod";
import axios from "axios";
import { API_URL } from "../constants";

export const CreatePlayerSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  // position: z
  // .lazy(() => PositionSchema.optional().nullable())
  // .optional()
  // .nullable(),
  // dateBirth: z.coerce.date().optional().nullable(),
  position: z
    .union([PositionSchema, z.literal("")])
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .optional(),
  dateBirth: z
    .string()
    .transform((val) => (val === "" ? null : new Date(val)))
    .optional()
    .nullable()
    // .refine(
    //   (val) => val === null || val === undefined || !isNaN(val.getTime()),
    //   {
    //     message: "Invalid date",
    //   }
    // ),
    .pipe(z.coerce.date().nullable().optional()),
  playerNumber: z.coerce.number().int().optional().nullable(),
  teamId: z.string().optional().nullable(),
});

export type CreatePlayer = z.infer<typeof CreatePlayerSchema>;

export const getPlayers = async (): Promise<Array<Player>> =>
  axios.get(`${API_URL}/players`).then((response) => response.data);

export const postPlayer = async (newPlayer: CreatePlayer) => {
  return axios.post(`${API_URL}/players`, newPlayer);
};
