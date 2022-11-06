import { useQuery, useQueryClient } from "react-query";
import { client } from "../../util/client";
import { useEffect } from "react";
import { toast } from "react-toastify";

const getVisits = async () => {
  const result = await client.records.getFullList("visits", 200, {
    sort: "-date",
  });
  return result;
};

const subscribe = async (queryClient) => {
  client.realtime.subscribe("visits", (e) => {
    console.log("subscribe", e);
    queryClient.invalidateQueries(["visits"]);
  });
};

function WorldMap() {
  const queryClient = useQueryClient();
  const visits = useQuery("visits", getVisits);

  useEffect(() => {
    subscribe(queryClient);
  }, []);

  useEffect(() => {
    if (visits.status === "error") toast.error("Error");
  }, [visits.status]);

  return (
    <>
      <div>
        <h1>Map</h1>
        {visits.status === "error" && <p>Error fetching data</p>}
        {visits.status === "loading" && <p>Fetching data...</p>}
        {visits.status === "success" && <div>render map</div>}
      </div>
    </>
  );
}

export default WorldMap;
