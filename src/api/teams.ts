import { API_URL } from "../constants";
import axios from "axios";
import { CreateTeam, Team } from "./schemas";

export const getTeams = async (): Promise<Array<Team>> =>
  axios.get(`${API_URL}/teams`).then((response) => response.data);

export const postTeam = async (newTeam: CreateTeam): Promise<Team> => {
  return axios.post(`${API_URL}/teams`, newTeam);
};

export const deleteTeam = async (teamId: string): Promise<Team> => {
  return axios.delete(`${API_URL}/teams/${teamId}`);
};
