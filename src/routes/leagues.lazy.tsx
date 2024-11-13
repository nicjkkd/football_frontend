import { createLazyFileRoute } from "@tanstack/react-router";
import { getLeagues } from "../api/leagues";
import { useQuery } from "react-query";
import { FixedSizeList as List } from "react-window";

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
    <p>{data[index].leagueName}</p>
  </div>
);
