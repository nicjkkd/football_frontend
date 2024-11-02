import { API_URL } from "../constants";
export const getLeagues = async (): Promise<any> => {
  const response = await fetch(`${API_URL}/leagues`);
  return response.json();
};
