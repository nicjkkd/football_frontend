import { API_URL } from "../constants";
import { FinalCreateLeague, League } from "./schemas";
import axios from "axios";

export const getLeagues = async (): Promise<Array<League>> =>
  axios.get(`${API_URL}/leagues`).then((response) => response.data);

export const postLeague = async (newLeague: FinalCreateLeague) => {
  return axios.post(`${API_URL}/leagues`, newLeague);
};
