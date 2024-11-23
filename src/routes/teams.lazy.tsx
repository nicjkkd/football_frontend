import { createLazyFileRoute } from "@tanstack/react-router";
import { getTeams } from "../api/teams";
import { useQuery } from "react-query";
import { FixedSizeList as List } from "react-window";
import CreateTeam from "../components/CreateTeam";
import TeamsRow from "../components/TeamsRow";

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
              {TeamsRow}
            </List>
          </div>
        </div>
      </div>
    </>
  );
}
