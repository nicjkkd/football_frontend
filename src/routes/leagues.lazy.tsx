import { createLazyFileRoute } from "@tanstack/react-router";
import { getLeagues, deleteLeague } from "../api/leagues";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { FixedSizeList as List } from "react-window";
import CreateLeague from "../components/CreateLeague";

export const Route = createLazyFileRoute("/leagues")({
  component: Leagues,
});

function Leagues() {
  const query = useQuery({
    queryKey: ["leagues"],
    queryFn: getLeagues,
    refetchOnMount: true,
  });

  console.log(query.data);

  if (query.isError) {
    return <p>Error with fetching leagues</p>;
  }

  if (query.isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="m-10 text-lg font-medium text-gray-800">
        Hello from Leagues!
      </div>

      <CreateLeague />

      <div className="m-5">
        <div className="overflow-x-auto w-full">
          <table
            className="min-w-full table-auto border-collapse border border-gray-300"
            aria-label="Players Table"
          >
            <thead>
              <tr className="bg-gray-100 text-sm font-semibold text-gray-700">
                <th className="px-4 py-2 border-b">Leagues Name</th>
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
