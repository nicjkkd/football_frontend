import { API_URL } from "../constants";
import { League } from "./generated/zod";
import axios from "axios";

export const getLeagues = async (): Promise<Array<League>> =>
  axios.get(`${API_URL}/leagues`).then((response) => response.data);
