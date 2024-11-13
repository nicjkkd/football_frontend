import { createLazyFileRoute } from "@tanstack/react-router";
import { getTeams } from "../api/teams";
import { useQuery } from "react-query";
import { FixedSizeList as List } from "react-window";

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
      <div className="flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 p-4">
        <List
          className="w-full m-10 border border-gray-200 rounded-md overflow-y-auto"
          height={200}
          width="100%"
          itemCount={query.data?.length || 0}
          itemData={query.data}
          itemSize={50}
        >
          {Row}
        </List>
      </div>
    </>
  );
}

const Row = ({ index, style, data }: any) => (
  <div style={style}>
    <p className="">{data[index].teamName}</p>
  </div>
);
