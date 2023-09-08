import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";

import { Base } from "@iguhealth/components";
import { Resource } from "@iguhealth/fhir-types";

import { getClient } from "../data/client";

export default function Resources() {
  const c = useRecoilValue(getClient);
  const [data, setData] = React.useState<Resource[]>([]);
  useEffect(() => {
    c.search_system({}, [
      { name: "_count", value: [10] },
      { name: "_sort", value: ["-_lastUpdated"] },
    ]).then((response) => {
      setData(response.resources);
    });
  }, []);
  return (
    <>
      <h2 className="text-xl font-semibold">Latest Resources</h2>
      <Base.Table
        data={data}
        columns={[
          {
            name: "Resource Type",
            selector: "$this.resourceType",
            selectorType: "fhirpath",
          },
          {
            name: "Author",
            selector:
              "$this.meta.extension.where(url='https://iguhealth.app/author').valueString",
            selectorType: "fhirpath",
          },
          {
            name: "Last Updated",
            selector: "$this.meta.lastUpdated",
            selectorType: "fhirpath",
          },
        ]}
      />
    </>
  );
}
