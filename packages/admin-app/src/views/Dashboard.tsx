import React from "react";
import { useRecoilValue } from "recoil";

import { Loading } from "@iguhealth/components";

import Card from "../components/Card";
import { getUsageStatistics } from "../db/usage_statistics";

const Dashboard = () => {
  const usageStatistics = useRecoilValue(getUsageStatistics);

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <div className="mt-4 flex flex-wrap justify-center">
        {usageStatistics?.statistics?.map((statistic) => (
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
