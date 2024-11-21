import { memo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { deleteTeam } from "../api/teams";
import { Team } from "../api/schemas";
import { ListChildComponentProps } from "react-window";

const TeamsRow: React.FC<ListChildComponentProps<Team[]>> = ({
  index,
  style,
  data,
}) => {
  const team = data[index];
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteTeam,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      console.log(`Deleted:`, data);
    },
  });

  const handleClick = (teamId: string) => {
    mutate(teamId);
  };

  return (
    <div
      style={style}
      className={`flex justify-between p-2 text-sm ${
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      }`}
    >
      <div className="w-1/5 px-4 py-2">{team.teamName}</div>
      <div className="w-1/5 px-4 py-2">{team.city}</div>
      <div className="w-1/5 px-4 py-2">{team.since}</div>
      <button
        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all"
        title="Delete Player"
        onClick={() => {
          handleClick(team.id);
        }}
      >
        X
      </button>
    </div>
  );
};

export default memo(TeamsRow);
