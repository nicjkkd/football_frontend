import { Player, UpdateLeague, UpdatePlayer, UpdateTeam } from "./api/schemas";

export interface SelectOptionsType {
  value: string;
  label: string;
}

export type PlayerWithTeamName = Player & {
  playerTeamName: string | undefined;
};

export interface UpdatePlayerProps {
  playerId: string;
  playerChanges: UpdatePlayer;
}

export interface UpdateTeamProps {
  teamId: string;
  teamChanges: UpdateTeam;
}

export interface UpdateLeagueProps {
  leagueId: string;
  leagueChanges: UpdateLeague;
}
