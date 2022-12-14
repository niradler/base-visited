import { useQuery, useQueryClient } from "react-query";
import { client } from "../../util/client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { Link } from "react-router-dom";

const getVisits = async () => {
  const result = await client.records.getFullList("visits", 200, {
    expand: "country",
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

function SharedMap({ annotations = [], shared = false }) {
  const geoUrl =
    "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";
  return (
    <ComposableMap style={{ "border-style": "solid" }}>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} />
          ))
        }
      </Geographies>
      {annotations.map((annotation) => (
        <Marker
          coordinates={annotation.subject}
          fill="#777"
          key={annotation.id}
        >
          <text fontSize="8">
            {shared ? (
              <Link to={`/`}>📍</Link>
            ) : (
              <Link to={`/visits/${annotation.id}`}>📍</Link>
            )}
          </text>
        </Marker>
      ))}
    </ComposableMap>
  );
}
function WorldMapPage() {
  const queryClient = useQueryClient();
  const visits = useQuery("visits", getVisits);
  const [annotations, setAnnotations] = useState();

  useEffect(() => {
    subscribe(queryClient);
  }, [queryClient]);

  useEffect(() => {
    if (visits.status === "error") toast.error("Error");
    else if (Array.isArray(visits.data)) {
      setAnnotations(
        visits.data.map((visit) => {
          const country = visit["@expand"].country;
          return {
            text: country?.name,
            subject: [country?.longitude, country?.latitude],
            id: visit.id,
          };
        })
      );
    }
  }, [visits.status]);

  return (
    <>
      <div>
        {visits.status === "error" && <p>Error fetching data</p>}
        {visits.status === "loading" && <p>Fetching data...</p>}
        {annotations && <SharedMap annotations={annotations} />}
      </div>
    </>
  );
}

export default WorldMapPage;
