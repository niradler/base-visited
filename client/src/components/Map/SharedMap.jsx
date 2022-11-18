import { useQuery, useQueryClient } from "react-query";
import { client } from "../../util/client";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { Link, useLocation } from "react-router-dom";

const getVisits = async () => {
  const result = await client.records.getFullList("visits", 200, {
    expand: "country",
    sort: "-date",
  });
  return result;
};

const getShare = async (query = {}) => {
  const result = await client.records.getList("shares", 1, 200, query);
  return result;
};

const subscribe = async (queryClient) => {
  client.realtime.subscribe("visits", (e) => {
    console.log("subscribe", e);
    queryClient.invalidateQueries(["visits"]);
  });
};

function useQueryParams() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}
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
  const [annotations, setAnnotations] = useState();
  const [sharedKey, setSharedKey] = useState();
  const query = useQueryParams();
  const share = useQuery(["share", sharedKey], () =>
    getShare({ key: sharedKey })
  );

  useEffect(() => {
    subscribe(queryClient);
  }, [queryClient]);

  useEffect(() => {
    const key = query.get("key");
    if (key) {
      setSharedKey(key);
    }
  }, [query]);

  useEffect(() => {
    console.log(share);
  }, [sharedKey, share]);

  return (
    <>
      <div></div>
    </>
  );
}

export default WorldMapPage;
