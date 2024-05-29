import React from "react";

import { versionUrl } from "@iguhealth/client/http";
import {
  Button,
  Input,
  Loading,
  Toaster,
  useIGUHealth,
} from "@iguhealth/components";
import { R4, R4B } from "@iguhealth/fhir-types/versions";
import { IDTokenPayload } from "@iguhealth/jwt";

function copytoClipboard(token: string | undefined) {
  if (token) {
    navigator.clipboard.writeText(token);
    Toaster.success("Value copied");
  }
}

interface SettingProps {
  user?: IDTokenPayload<string>;
}

function Copyable({
  value,
  label,
}: Readonly<{ value?: string; label?: string }>) {
  return (
    <label>
      <span className="font-weight-500">{label}</span>
      <div className="flex flex-row">
        <div className="flex flex-1">
          <Input readOnly value={value} />
        </div>
        <Button
          onClick={(e) => {
            e.preventDefault();
            copytoClipboard(value);
          }}
          className="ml-1"
        >
          Copy
        </Button>
      </div>
    </label>
  );
}

function SettingDisplay({ user }: Readonly<SettingProps>) {
  const iguhealth = useIGUHealth();
  return (
    <div className="flex flex-col flex-1">
      <h2 className="text-2xl font-semibold mb-8">Settings</h2>
      <div className="mb-2">
        <h2 className="text-xl font-semibold ">User Information</h2>
        <div className="flex flex-col p-2">
          <div className="mb-2">
            <label className="block font-medium">Name:</label>
            <span>{user?.name}</span>
          </div>
          <div className="mb-2">
            <label className="block font-medium">Email:</label>
            <span>{user?.email}</span>
          </div>
        </div>
      </div>
      <div className="mb-2">
        <h2 className="text-xl font-semibold">Endpoints</h2>
        <div className="pl-2 mt-4 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">FHIR</h3>
            <div className="pl-2 space-y-2">
              <div className="flex flex-col ">
                <Copyable
                  label="R4"
                  value={
                    iguhealth.rootURL ? versionUrl(iguhealth.rootURL, R4) : ""
                  }
                />
              </div>
              <div className="flex flex-col ">
                <Copyable
                  label="R4B"
                  value={
                    iguhealth.rootURL ? versionUrl(iguhealth.rootURL, R4B) : ""
                  }
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Security</h3>
            <div className="pl-2 space-y-2">
              <div className="flex flex-col ">
                <Copyable
                  label="Token"
                  value={iguhealth.well_known?.token_endpoint}
                />
              </div>
              <div className="flex flex-col ">
                <Copyable
                  label="Authorization"
                  value={iguhealth.well_known?.authorization_endpoint}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const iguhealth = useIGUHealth();
  return (
    <React.Suspense
      fallback={
        <div className="h-screen flex flex-1 justify-center items-center flex-col">
          <Loading />
          <div className="mt-1 ">Loading...</div>
        </div>
      }
    >
      <SettingDisplay user={iguhealth.user} />
    </React.Suspense>
  );
}
