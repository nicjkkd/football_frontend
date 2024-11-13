import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "react-query";
import { getPlayers } from "../api/players";
import { FixedSizeList as List } from "react-window";

export const Route = createLazyFileRoute("/players")({
  component: Players,
});

function Players() {
  const query = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
    refetchOnMount: false,
  });

  if (query.isError) {
    return <p>Error with fetching players</p>;
  }

  if (query.isLoading) {
    return <p>Loading...</p>;
  }

  console.log(query.data);

  return (
    <>
      <div className="m-10 text-lg font-medium text-gray-800">
        Hello from Players!
      </div>

      <div className="flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 p-4">
        <List
          className="w-full m-10 border border-gray-200 rounded-md overflow-y-auto"
          height={500}
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
    <p>{data[index].firstName + " " + data[index].lastName}</p>
  </div>
);
