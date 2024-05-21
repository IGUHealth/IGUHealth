import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import { Loading } from "@iguhealth/components";
import { R4 } from "@iguhealth/fhir-types/versions";
import { IguhealthUsageStatistics } from "@iguhealth/generated-ops/lib/r4/ops";

import Card from "../components/Card";
import { getClient } from "../db/client";

const Dashboard = () => {
  const [stats, setStats] = useState<IguhealthUsageStatistics.Output>({
    statistics: [],
  });

  const client = useRecoilValue(getClient);
  useEffect(() => {
    client
      .invoke_system(IguhealthUsageStatistics.Op, {}, R4, {})
      .then((stats) => setStats(stats));
  }, [setStats]);

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <div className="mt-4 flex flex-wrap justify-center">
        {stats?.statistics?.map((statistic) => (
          <Card
            key={statistic.name}
            title={`${statistic.version} ${statistic.name}`}
            limit={statistic.limit}
            usage={statistic.usage}
            description={statistic.description ?? ""}
          />
        ))}
      </div>
    </div>
  );
};

export default function DashboardView() {
  return (
    <React.Suspense
      fallback={
        <div className="h-screen flex flex-1 justify-center items-center flex-col">
          <Loading />
          <div className="mt-1 ">Loading...</div>
        </div>
      }
    >
      <Dashboard />
    </React.Suspense>
  );
}
