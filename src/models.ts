import { Player } from "./api/schemas";

export interface SelectOptionsType {
  value: string;
  label: string;
}

export type PlayerWithTeamName = Player & {
  playerTeamName: string | undefined;
};
