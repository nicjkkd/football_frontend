import { useMutation, useQueryClient } from "react-query";
import { deletePlayer } from "../api/players";
import { memo, useMemo } from "react";
import { ListChildComponentProps } from "react-window";
import { Player } from "../api/schemas";

type PlayerWithTeamName = Player & { playerTeamName: string | undefined };

const PlayersRow: React.FC<ListChildComponentProps<PlayerWithTeamName[]>> = ({
  index,
  style,
  data,
}) => {
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

export default memo(PlayersRow);
