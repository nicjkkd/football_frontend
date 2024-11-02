import { createLazyFileRoute } from "@tanstack/react-router";
import { getTeams } from "../api/teams";
import { useQuery } from "react-query";

export const Route = createLazyFileRoute("/teams")({
  component: Teams,
});

function Teams() {
  // @ts-ignore
  const query = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  });
  console.log(query);

  if (query.isError) {
    return <p>Error with fetching teams</p>;
  }

  if (query.isLoading) {
    return <p>Loading...</p>;
  }

  console.log(query.data);

  return <div className="p-2">Hello from Teams!</div>;
}
