import { API_URL } from "../constants";

export const getTeams = async (): Promise<any> => {
  const response = await fetch(`${API_URL}/teams`);
  return response.json();
};
