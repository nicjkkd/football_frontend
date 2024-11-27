import { API_URL } from "../constants";
import { FinalCreateLeague, League } from "./schemas";
import axios from "axios";

export const getLeagues = async (): Promise<Array<League>> =>
  axios.get(`${API_URL}/leagues`).then((response) => response.data);

export const postLeague = async (
  newLeague: FinalCreateLeague
): Promise<League> => {
  return axios.post(`${API_URL}/leagues`, newLeague);
};

export const deleteLeague = async (leagueId: string): Promise<League> => {
  return axios.delete(`${API_URL}/leagues/${leagueId}`);
};
