import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useParams, useNavigate } from "react-router-dom";

import { ResourceType, Resource } from "@iguhealth/fhir-types/r4/types";

import { getClient } from "../../data/client";
import ResourceEditorComponent from "../../components/ResourceEditor";
import OperationDefinitionView from "./OperationDefinition";

export default function DefaultResourceEditorView() {
  const client = useRecoilValue(getClient);
  const [resource, setResource] = useState<Resource | undefined>(undefined);
  const navigate = useNavigate();

  const { resourceType, id } = useParams();

  useEffect(() => {
    if (id !== "new")
      client
        .read({}, resourceType as ResourceType, id as id)
        .then((response) => {
          setResource(response);
        });
  }, [resourceType, id]);

  switch (resourceType) {
    case "OperationDefinition":
      return (
        <OperationDefinitionView
          id={id as string}
          resourceType={resourceType as ResourceType}
          resource={resource}
          onChange={(resource) => {
            setResource(resource);
          }}
        />
      );
    default:
      return (
        <ResourceEditorComponent
          id={id as string}
          resourceType={resourceType as ResourceType}
          resource={resource}
          onChange={(resource) => {
            setResource(resource);
          }}
        />
      );
  }
}
