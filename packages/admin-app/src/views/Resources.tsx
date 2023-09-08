import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";

import { Resource } from "@iguhealth/fhir-types";

import { getClient } from "../data/client";

export default function Resources() {
  const c = useRecoilValue(getClient);
  const [data, setData] = React.useState<Resource[]>([]);
  useEffect(() => {
    c.search_system({}, [{ name: "_count", value: [10] }]).then((response) => {
      setData(response.resources);
    });
  }, []);
  return <div>{JSON.stringify(data)}</div>;
}
