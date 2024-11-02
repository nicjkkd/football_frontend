import { API_URL } from "../constants";
import { Player } from "./generated/zod";

export const getPlayers = async (): Promise<Player | undefined> => {
  const response = await fetch(`${API_URL}/players`);
  return response.json();
};
