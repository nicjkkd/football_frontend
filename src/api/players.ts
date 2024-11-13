import { Player } from "./generated/zod";
import { z } from "zod";
import axios from "axios";
import { API_URL } from "../constants";

export const CreatePlayerSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  dateBirth: z.coerce.date().optional().nullable(),
  playerNumber: z.number().int().optional().nullable(),
  teamId: z.string().optional().nullable(),
});

export type CreatePlayer = z.infer<typeof CreatePlayerSchema>;

export const getPlayers = async (): Promise<Array<Player>> =>
  axios.get(`${API_URL}/players`).then((response) => response.data);

export const postPlayer = async (newPlayer: CreatePlayer) => {
  return axios.post(`${API_URL}/players`, newPlayer);
};
