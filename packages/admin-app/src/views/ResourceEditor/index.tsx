import { useParams } from "react-router-dom";
import ResourceEditorComponent from "../../components/ResourceEditor";
import OperationDefinitionView from "./OperationDefinition";

export default function DefaultResourceEditorView() {
  const params = useParams();
  switch (params.resourceType) {
    case "OperationDefinition":
      return <OperationDefinitionView />;
    default:
      return <ResourceEditorComponent />;
  }
}
