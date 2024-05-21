import React from "react";
import { useRecoilValue } from "recoil";

import { Loading, Table } from "@iguhealth/components";

import { getUsageStatistics } from "../db/usage_statistics";

const Dashboard = () => {
  const usageStatistics = useRecoilValue(getUsageStatistics);

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
      <div>
        <h3 className="text-xl font-semibold mb-2 mt-4">Usage</h3>
        <Table
          data={usageStatistics?.statistics ?? []}
          columns={[
            {
              content: "Version",
              id: "version",
              selectorType: "fhirpath",
              selector: "version",
            },
            {
              content: "Name",
              id: "name",
              selectorType: "fhirpath",
              selector: "name",
            },
            {
              content: "Usage",
              id: "usage",
              selectorType: "fhirpath",
              selector: "usage",
            },

            {
              content: "Limit",
              id: "limit",
              selectorType: "fhirpath",
              selector: "limit",
            },
          ]}
        />
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
