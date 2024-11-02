import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "react-query";
import { getPlayers } from "../api/players";

export const Route = createLazyFileRoute("/players")({
  component: Players,
});

function Players() {
  const query = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  });
  console.log(query);

  if (query.isError) {
    return <p>Error with fetching players</p>;
  }

  if (query.isLoading) {
    return <p>Loading...</p>;
  }

  console.log(query.data);

  return (
    <div className="p-2">
      <h3>Welcome Players!</h3>
    </div>
  );
}
