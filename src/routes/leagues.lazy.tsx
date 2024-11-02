import { createLazyFileRoute } from "@tanstack/react-router";
import { getLeagues } from "../api/leagues";
import { useQuery } from "react-query";

export const Route = createLazyFileRoute("/leagues")({
  component: Leagues,
});

function Leagues() {
  // @ts-ignore
  const query = useQuery({
    queryKey: ["leagues"],
    queryFn: getLeagues,
  });
  console.log(query);

  if (query.isError) {
    return <p>Error with fetching leagues</p>;
  }

  if (query.isLoading) {
    return <p>Loading...</p>;
  }

  console.log(query.data);

  return <div className="p-2">Hello from Leagues!</div>;
}
