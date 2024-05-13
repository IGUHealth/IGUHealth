import { PlusIcon } from "@heroicons/react/24/outline";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { Button, FHIRGenerativeSearchTable } from "@iguhealth/components";
import { R4, ResourceType } from "@iguhealth/fhir-types/versions";

import { getClient } from "../db/client";

export default function ResourceTypeView() {
  const client = useRecoilValue(getClient);
  const params = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col flex-1 w-full text-slate-700">
      <div className="flex mb-4 justify-center items-center">
        <h2 className="text-left flex text-xl font-semibold mr-4 ">
          {params.resourceType}
        </h2>
        <div className="flex flex-1 justify-end">
          <div className="pr-4">
            <Button
              className="ml-2 font-medium"
              buttonSize="small"
              buttonType="secondary"
              onClick={() =>
                navigate(
                  generatePath("/resources/:resourceType/:id", {
                    resourceType: params.resourceType as string,
                    id: "new",
                  }),
                )
              }
            >
              <div className="flex items-center justify-center ">
                <PlusIcon className="w-4 h-4 mr-1" /> <span>New</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-auto">
        <FHIRGenerativeSearchTable
          client={client}
          fhirVersion={R4}
          resourceType={params.resourceType as ResourceType<R4>}
        />
      </div>
    </div>
  );
}
