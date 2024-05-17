import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import {
  Button,
  FHIRGenerativeSearchTable,
  FHIRStringEditable,
  Modal,
  Toaster,
} from "@iguhealth/components";
import {
  AllResourceTypes,
  R4,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import { IguhealthInviteUser } from "@iguhealth/generated-ops/r4";

import { getClient } from "../db/client";

function InviteModal({ setOpen }: { setOpen: (open: boolean) => void }) {
  const client = useRecoilValue(getClient);
  const [email, setEmail] = useState<string | undefined>();
  return (
    <div className="space-y-4 mt-4">
      <FHIRStringEditable
        label="Email"
        value={email}
        onChange={(email) => {
          setEmail(email);
        }}
      />
      <div className="flex items-center">
        <div>
          <Button
            buttonType="secondary"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
        </div>
        <div className="flex grow justify-end">
          <Button
            onClick={() => {
              if (!email) {
                Toaster.error("Email is required");
                return;
              }

              client
                .invoke_type(IguhealthInviteUser.Op, {}, R4, "Membership", {
                  email,
                })
                .then((output) => {
                  Toaster.success(output.issue?.[0]?.diagnostics ?? "");
                  setOpen(false);
                })
                .catch((e) => {
                  Toaster.error(
                    e?.operationOutcome?.issue?.[0]?.diagnostics ?? "",
                  );
                });
            }}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

function ResourceTypeHeader() {
  const params = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex mb-4 justify-center items-center">
      <h2 className="text-left flex text-xl font-semibold mr-4 ">
        {params.resourceType}
      </h2>
      <div className="flex flex-1 justify-end">
        <div className="pr-4">
          {params.resourceType === "Membership" ? (
            <Modal
              modalTitle="Invite User"
              ModalContent={(setOpen) => <InviteModal setOpen={setOpen} />}
            >
              {(setopen) => (
                <Button
                  className="ml-2 font-medium"
                  buttonSize="small"
                  buttonType="secondary"
                  onClick={() => {
                    setopen(true);
                  }}
                >
                  Send Invite
                </Button>
              )}
            </Modal>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResourceTypeView() {
  const client = useRecoilValue(getClient);
  const params = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col flex-1 w-full text-slate-700">
      <ResourceTypeHeader />
      <div className="overflow-auto">
        <FHIRGenerativeSearchTable
          key={params.resourceType}
          onRowClick={(row) => {
            navigate(
              generatePath("/resources/:resourceType/:id", {
                resourceType: params.resourceType as string,
                id: (row as Resource<R4, AllResourceTypes>).id as string,
              }),
            );
          }}
          client={client}
          fhirVersion={R4}
          resourceType={params.resourceType as ResourceType<R4>}
        />
      </div>
    </div>
  );
}
