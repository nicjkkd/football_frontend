import { API_URL } from "../constants";
import { Team } from "./generated/zod";
import axios from "axios";

export const getTeams = async (): Promise<Array<Team>> =>
  axios.get(`${API_URL}/teams`).then((response) => response.data);
