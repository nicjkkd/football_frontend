import { memo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { ListChildComponentProps } from "react-window";
import { League } from "../../api/schemas";
import { deleteLeague } from "../../api/leagues";

const LeaguesRow: React.FC<ListChildComponentProps<League[]>> = ({
  index,
  style,
  data,
}) => {
  const league = data[index];
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteLeague,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["leagues"] });
      console.log(`Deleted:`, data);
    },
  });

  const handleClick = (leagueId: string) => {
    mutate(leagueId);
  };

  return (
    <div
      style={style}
      className={`flex justify-between p-2 text-sm ${
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      }`}
    >
      <div className="w-1/5 px-4 py-2">{league.leagueName}</div>
      <button
        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all"
        title="Delete Player"
        onClick={() => {
          handleClick(league.id);
        }}
      >
        X
      </button>
    </div>
  );
};

export default memo(LeaguesRow);
