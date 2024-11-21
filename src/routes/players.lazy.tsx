import { createLazyFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { deletePlayer, getPlayers } from "../api/players";
import { FixedSizeList as List } from "react-window";
import CreatePlayer from "../components/CreatePlayer";
import { getTeams } from "../api/teams";
import { useMemo } from "react";
import { Team } from "../api/schemas";

export const Route = createLazyFileRoute("/players")({
  component: Players,
});

function Players() {
  const playersQuery = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
    refetchOnMount: false,
  });

  const teamsQuery = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
    refetchOnMount: false,
  });

  const teamMapById = useMemo<Record<string, Team | undefined>>(() => {
    const teamMap: Record<string, Team | undefined> = {};
    teamsQuery.data?.forEach((team) => {
      teamMap[team.id] = team;
    });
    return teamMap;
  }, [teamsQuery.data]);

  const playersDataWithTeamName = useMemo(() => {
    const playersArrayWithTeamName = playersQuery.data?.map((player) => {
      const teamId = player.teamId || "";
      return {
        ...player,
        playerTeamName: teamMapById[teamId]?.teamName,
      };
    });
    return playersArrayWithTeamName;
  }, [teamsQuery.data, playersQuery.data]);

  if (playersQuery.isError) {
    return <p>Error with fetching players</p>;
  }

  if (playersQuery.isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="m-10 text-lg font-medium text-gray-800">
        Hello from Players!
      </div>

      <CreatePlayer />

      <div className="m-5">
        <div className="overflow-x-auto w-full">
          <table
            className="min-w-full table-auto border-collapse border border-gray-300"
            aria-label="Players Table"
          >
            <thead>
              <tr className="bg-gray-100 text-sm font-semibold text-gray-700">
                <th className="px-4 py-2 border-b">First Name</th>
                <th className="px-4 py-2 border-b">Last Name</th>
                <th className="px-4 py-2 border-b">Date of Birth</th>
                <th className="px-4 py-2 border-b">Position</th>
                <th className="px-4 py-2 border-b">Player Number</th>
                <th className="px-4 py-2 border-b">Player Team</th>
              </tr>
            </thead>
          </table>

          <div className="flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 p-4 ">
            <List
              className="w-full"
              height={500}
              width="100%"
              itemCount={playersDataWithTeamName?.length || 0}
              itemData={playersDataWithTeamName}
              itemSize={50}
            >
              {Row}
            </List>
          </div>
        </div>
      </div>
    </>
  );
}

// type PlayerWithTeamName = Player & { teamName: string };

const Row = ({ index, style, data }: any) => {
  const player = data[index];
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deletePlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });

  const playerAge = useMemo(() => {
    return player.dateBirth
      ? new Date(player.dateBirth).toLocaleDateString()
      : "Invalid Date";
  }, [player.dateBirth]);

  const handleClick = (playerId: string) => {
    mutate(playerId);
  };

  return (
    <div
      style={style}
      className={`flex justify-between p-2 text-sm ${
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      }`}
    >
      <div className="w-1/5 px-4 py-2">{player.firstName}</div>
      <div className="w-1/5 px-4 py-2">{player.lastName}</div>
      <div className="w-1/5 px-4 py-2">{playerAge}</div>

      <div className="w-1/5 px-4 py-2">{player.position || "BENCH"}</div>
      <div className="w-1/5 px-4 py-2">
        {player.playerNumber || "No Player number"}
      </div>
      <div className="w-1/5 px-4 py-2">
        {player.playerTeamName || player.teamId || "No Team"}
      </div>
      <button
        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all"
        title="Delete Player"
        onClick={() => {
          handleClick(player.id);
        }}
      >
        X
      </button>
    </div>
  );
};
