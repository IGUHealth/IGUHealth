import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useParams, useNavigate } from "react-router-dom";

import { Base } from "@iguhealth/components";
import {
  id,
  ResourceType,
  Resource,
  OperationDefinition,
  OperationOutcome,
  StructureDefinition,
} from "@iguhealth/fhir-types/r4/types";

import { getClient } from "../../data/client";
import ResourceEditorComponent from "../../components/ResourceEditor";
import OperationDefinitionView from "./OperationDefinition";

export default function DefaultResourceEditorView() {
  const client = useRecoilValue(getClient);
  const [resource, setResource] = useState<Resource | undefined>(undefined);
  const [structureDefinition, setStructureDefinition] = useState<
    StructureDefinition | undefined
  >(undefined);
  const navigate = useNavigate();

  const { resourceType, id } = useParams();

  const actions = [
    {
      key: "Update",
      label: id === "new" ? "Create" : "Update",
      onClick: () => {
        try {
          const editPromise =
            id === "new"
              ? client.create({}, {
                  ...resource,
                  resourceType, // Validate that resourceTypes align.
                } as Resource)
              : client.update({}, {
                  ...resource,
                  resourceType,
                  id,
                } as Resource);
          Base.Toaster.promise(editPromise, {
            loading: id === "new" ? "Creating Resource" : "Updating Resource",
            success: (success) =>
              `Updated ${(success as Resource).resourceType}`,
            error: (error) => {
              const message = (error.operationOutcome as OperationOutcome).issue
                .map((issue) => issue.diagnostics)
                .join("\n");

              return message;
            },
          }).then((value) =>
            navigate(`/resources/${resourceType}/${(value as Resource).id}`, {
              replace: true,
            })
          );
        } catch (e) {
          Base.Toaster.error(`${e}`);
        }
      },
    },
    {
      key: "Delete",
      className: "text-red-600 hover:bg-red-600 hover:text-white",
      label: "Delete",
      onClick: () => {
        const deletingResource = client.delete(
          {},
          resourceType as ResourceType,
          id as id
        );
        Base.Toaster.promise(deletingResource, {
          loading: "Deleting Resource",
          success: () => `Deleted ${resourceType}`,
          error: (error) => {
            return `${error}`;
          },
        }).then(() => navigate(`/resources/${resourceType}`));
      },
    },
  ];

  useEffect(() => {
    client
      .batch(
        {},
        {
          type: "batch",
          resourceType: "Bundle",
          entry: [
            {
              request: {
                method: "GET",
                url: `${resourceType}/${id}`,
              },
            },
            {
              request: {
                method: "GET",
                url: `StructureDefinition/${resourceType}`,
              },
            },
          ],
        }
      )
      .then((response) => {
        setResource(response.entry?.[0]?.resource);
        setStructureDefinition(
          response.entry?.[1]?.resource as StructureDefinition
        );
      });
  }, [resourceType, id]);

  console.log("RESOURCEEDIT:", resource);

  switch (resourceType) {
    case "OperationDefinition":
      return (
        <OperationDefinitionView
          id={id as string}
          resourceType={resourceType as ResourceType}
          actions={actions}
          resource={resource as OperationDefinition}
          structureDefinition={structureDefinition}
          onChange={setResource}
        />
      );
    default:
      return (
        <ResourceEditorComponent
          id={id as string}
          resourceType={resourceType as ResourceType}
          actions={actions}
          resource={resource}
          structureDefinition={structureDefinition}
          onChange={setResource}
        />
      );
  }
}
