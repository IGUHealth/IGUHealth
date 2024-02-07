import { FHIRRequest } from "@iguhealth/client/types";
import { AccessPolicy } from "@iguhealth/fhir-types/r4/types";

/*
 ** Create a window where the user can only see the resources that they have access to.
 ** Is accomplished by creating a SQL filter that is appended to the query.
 ** This filter is derived from the user's access policy.
 ** The end result of derivesqlfilter will be a list of versionids which are then joined against results of query.

 ** @param request - The FHIR request.
 ** @param policy - The user's access policy.
 */
function deriveSqlFilter(request: FHIRRequest, policy: AccessPolicy): string {
  return "";
}
