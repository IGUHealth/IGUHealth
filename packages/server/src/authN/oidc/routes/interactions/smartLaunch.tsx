import React from "react";

import { FHIRGenerativeSearchTableDisplay } from "@iguhealth/components";
import { id } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { asRoot } from "../../../../fhir-api/types.js";
import * as views from "../../../../views/index.js";
import { OIDCRouteHandler } from "../../index.js";
import { OIDCError } from "../../middleware/oauth_error_handling.js";
import * as parseScopes from "../../scopes/parse.js";

function getLaunchScopes(
  scopes: parseScopes.Scope[],
): parseScopes.LaunchTypeScope[] {
  return scopes.filter((scope) => scope.type === "launch-type");
}

function canLaunch(scopes: parseScopes.Scope[]): boolean {
  return scopes.find((scope) => scope.type === "launch") !== undefined;
}

/**
 *
 */
export function smartLaunchGET(): OIDCRouteHandler {
  return async (ctx) => {
    const scopes = ctx.state.oidc.scopes ?? [];
    if (!canLaunch(scopes)) {
      throw new OIDCError({
        error: "invalid_scope",
        error_description: "Launch scope required.",
      });
    }

    const launchScopes = getLaunchScopes(scopes);

    if (launchScopes.length < 1) {
      throw new OIDCError({
        error: "invalid_scope",
        error_description: "Launch scope required.",
      });
    }

    const launchTypes = launchScopes.map((scope) => scope.launchType);

    const searchParameters = await ctx.state.iguhealth.client.search_type(
      asRoot(ctx.state.iguhealth),
      R4,
      "SearchParameter",
      [
        { name: "base", value: ["Resource", "Patient"] },
        { name: "_count", value: ["100"] },
      ],
    );

    return new Promise((_resolve, reject) => {
      const { pipe, abort } = views.renderPipe(
        <FHIRGenerativeSearchTableDisplay
          parameters={[]}
          onParametersChange={(z) => {}}
          searchParameters={searchParameters.resources}
          data={{
            total: 1,
            resources: [
              {
                resourceType: "Patient",
                id: "1" as id,
                name: [{ family: "Doe", given: ["John"] }],
              },
            ],
          }}
        />,
        {
          onShellReady() {
            ctx.respond = false;
            ctx.status = 200;
            ctx.set("Content-Type", "text/html");
            pipe(ctx.res);
            ctx.res.end();
          },
          onShellError() {
            ctx.status = 500;
            abort();
            ctx.set("Content-Type", "text/html");
            ctx.body = "<!doctype html><p>Loading...</p></script>";
            reject(
              new OperationError(
                outcomeError("exception", "Failed to render launch"),
              ),
            );
          },
          onError(error) {
            console.error(error);
            reject(
              new OperationError(
                outcomeError("exception", "Failed to render launch"),
              ),
            );
          },
        },
      );
    });
  };
}
