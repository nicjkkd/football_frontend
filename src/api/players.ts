import axios from "axios";
import { API_URL } from "../constants";
import { CreatePlayer, Player, UpdatePlayer } from "./schemas";

export const getPlayers = async (): Promise<Array<Player>> =>
  axios.get(`${API_URL}/players`).then((response) => response.data);

export const postPlayer = async (newPlayer: CreatePlayer): Promise<Player> => {
  return axios.post(`${API_URL}/players`, newPlayer);
};

export const deletePlayer = async (playerId: string): Promise<Player> => {
  return axios.delete(`${API_URL}/players/${playerId}`);
};

export const updatePlayer = async (
  playerId: string,
  playerChanges: UpdatePlayer
): Promise<Player> => {
  return axios.patch(`${API_URL}/players/${playerId}`, playerChanges);
};
