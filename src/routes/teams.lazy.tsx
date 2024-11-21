import { createLazyFileRoute } from "@tanstack/react-router";
import { getTeams, deleteTeam } from "../api/teams";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { FixedSizeList as List } from "react-window";
import CreateTeam from "../components/CreateTeam";

export const Route = createLazyFileRoute("/teams")({
  component: Teams,
});

function Teams() {
  const query = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
    refetchOnMount: true,
  });

  if (query.isError) {
    return <p>Error with fetching teams</p>;
  }

  if (query.isLoading) {
    return <p>Loading...</p>;
  }

  console.log(query.data);

  return (
    <>
      <div className="m-10 text-lg font-medium text-gray-800">
        Hello from Teams!
      </div>

      <CreateTeam />

      <div className="m-5">
        <div className="overflow-x-auto w-full">
          <table
            className="min-w-full table-auto border-collapse border border-gray-300"
            aria-label="Players Table"
          >
            <thead>
              <tr className="bg-gray-100 text-sm font-semibold text-gray-700">
                <th className="px-4 py-2 border-b">Team Name</th>
                <th className="px-4 py-2 border-b">City</th>
                <th className="px-4 py-2 border-b">Date of creation</th>
              </tr>
            </thead>
          </table>

          <div className="flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 p-4 ">
            <List
              className="w-full"
              height={500}
              width="100%"
              itemCount={query.data?.length || 0}
              itemData={query.data}
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

const Row = ({ index, style, data }: any) => {
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
