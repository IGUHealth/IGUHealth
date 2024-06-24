import Layout from "@theme/Layout";
import React, { useEffect, useMemo, useState } from "react";

import { R4, R4B, Resource } from "@iguhealth/fhir-types/versions";

function RenderAction({ action, report }) {
  if (action.operation) {
    return (
      <div>
        <div className="flex items-center mb-2">
          <div className="flex flex-1 mr-2">
            <span className="text-lg font-semibold">Operation</span>
          </div>
          <div
            className={`p-1 ${report.operation.result === "pass" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {report.operation.result}
          </div>
        </div>
        <table>
          <tr>
            <th>Type</th>
            <th>Resource</th>
            <th>SourceId</th>
            <th>TargetId</th>
            <th>ResponseId</th>
            <th>Parameters</th>
          </tr>
          <tr>
            <td>{action.operation?.type?.code}</td>
            <td>{action.operation?.resource}</td>
            <td>{action.operation?.sourceId}</td>
            <td>{action.operation?.targetId}</td>
            <td>{action.operation?.responseId}</td>
            <td>{action.operation?.params}</td>
          </tr>
        </table>
      </div>
    );
  } else if (action.assert) {
    return (
      <div>
        <div className="flex items-center mb-2">
          <div className="flex flex-1 mr-2">
            <span className="text-lg font-semibold">Assertion</span>
          </div>
          <div
            className={`p-1 ${report.assert.result === "pass" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {report.assert.result}
          </div>
        </div>
        <table>
          <tr>
            <th>Resource</th>
            <th>Expression</th>
            <th>Operator</th>
            <th>Value</th>
            <th>Compare to Source Id</th>
            <th>Compare to Source Expression</th>
          </tr>
          <tr>
            <td>{action.assert?.resource}</td>
            <td>{action.assert?.expression}</td>
            <td>{action.assert?.operator}</td>
            <td>{action.assert?.value}</td>
            <td>{action.assert?.compareToSourceId}</td>
            <td>{action.assert?.compareToSourceExpression}</td>
          </tr>
        </table>
      </div>
    );
  }
  return null;
}

function RenderTestScript({
  goBack,
  testScript,
  testReport,
}: {
  goBack: () => void;
  testScript: Resource<R4, "TestScript">;
  testReport: Resource<R4, "TestReport">;
}) {
  return (
    <main>
      <div className="pt-10 pb-12 container mx-auto">
        <div className="mb-4">
          <span
            className="cursor-pointer text-lg font-semibold text-blue-600 hover:text-blue-700"
            onClick={goBack}
          >
            Go Back
          </span>
        </div>

        <div className="mb-2">
          <span className="text-slate-300 text-sm">{testScript.id}</span>{" "}
        </div>
        <div className="mb-4">
          <h1 className="mr-2 mb-1">{testScript.title} </h1>
          <div>
            <span className="text-slate-500 text-base">
              {testScript.description}
            </span>{" "}
          </div>
        </div>

        <div>
          <div>
            <span>Fixtures</span>
          </div>
          <table>
            <tr>
              <th>id</th>
              <th>reference</th>
            </tr>
            {testScript.fixture?.map((fixture) => {
              return (
                <tr>
                  <td>{fixture.id}</td>
                  <td>{fixture.resource?.reference}</td>
                </tr>
              );
            })}
          </table>
          <div className="mb-4">
            <span className="block mb-2 font-bold text-2xl">Setup</span>
            {testScript.setup?.action?.map((action, ti) => (
              <RenderAction
                action={action}
                report={testReport.setup.action[ti]}
              />
            ))}
          </div>
          <div className="mb-4">
            <span className="block mb-2 font-bold text-2xl">Tests</span>
            {testScript.test?.map((test, ti) => (
              <div>
                <h4>{test.name}</h4>
                {test.action.map((action, actionIndex) => (
                  <RenderAction
                    action={action}
                    report={testReport.test[ti].action[actionIndex]}
                  />
                ))}
              </div>
            ))}
          </div>
          <div>
            <span className="block mb-2 font-bold text-2xl">Teardown</span>
            {testScript.teardown?.action?.map((action, ti) => (
              <RenderAction
                action={action}
                report={testReport.teardown.action[ti]}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function RenderReports() {
  const [r4Bundle, setR4Bundle] = useState<Resource<R4, "Bundle"> | undefined>(
    undefined,
  );
  const [r4bBundle, setR4BBundle] = useState<
    Resource<R4B, "Bundle"> | undefined
  >(undefined);

  const [context, setContext] = useState<
    | {
        testScript: Resource<R4, "TestScript">;
        testReport: Resource<R4, "TestReport">;
      }
    | undefined
  >(undefined);

  useEffect(() => {
    fetch("https://iguhealth.app/testscripts/r4-reports.json")
      .then((res) => res.json())
      .then(setR4Bundle)
      .catch(console.error);
    fetch("https://iguhealth.app/testscripts/r4b-reports.json")
      .then((res) => res.json())
      .then(setR4BBundle)
      .catch(console.error);
  }, []);

  const testScripts: Resource<R4, "TestScript">[] = useMemo(() => {
    return (
      r4Bundle?.entry
        ?.map((entry) => entry.resource)
        .filter((r) => r.resourceType === "TestScript") ?? []
    );
  }, [r4Bundle]);

  const testReports: Resource<R4, "TestReport">[] = useMemo(() => {
    return (
      r4Bundle?.entry
        ?.map((entry) => entry.resource)
        .filter((r) => r.resourceType === "TestReport") ?? []
    );
  }, [r4Bundle]);

  return (
    <Layout title={`Test Reports`} description="Test script reports">
      {context ? (
        <RenderTestScript
          goBack={() => setContext(undefined)}
          testScript={context.testScript}
          testReport={context.testReport}
        />
      ) : (
        <main>
          <div className="pt-10 pb-12 container mx-auto">
            <div className="mb-4">
              <h1 className="mb-2">Reports</h1>
              <span>
                Results from our{" "}
                <a
                  target="_blank"
                  href="https://www.npmjs.com/package/@iguhealth/testscript-runner"
                >
                  testscript runner
                </a>
                . Testscripts running against server can be found{" "}
                <a
                  target="_blank"
                  href="https://github.com/IGUHealth/IGUHealth/tree/main/packages/server/testscripts/r4"
                >
                  here
                </a>
                .
              </span>
            </div>
            <table>
              <tr>
                <th>id</th>
                <th className="w-[30%]">title</th>
                <th className="w-[70%]">description</th>
                <th>Status</th>
              </tr>
              {testScripts.map((testScript) => {
                const testReport = testReports.find(
                  (t) =>
                    t.testScript?.reference === `TestScript/${testScript.id}`,
                );

                return (
                  <tr
                    onClick={(_e) => {
                      setContext({ testScript, testReport });
                    }}
                    key={testScript.id}
                    className={`
                    cursor-pointer
                    ${
                      testReport.result === "pass"
                        ? "!bg-green-200 hover:!bg-green-300 !text-green-900"
                        : "!bg-red-200 hover:!bg-red-300 !text-red-900"
                    }
                    `}
                  >
                    <td>{testScript.id}</td>
                    <td>{testScript.title}</td>
                    <td>{testScript.description}</td>
                    <td>{testReport?.result}</td>
                  </tr>
                );
              })}
            </table>
          </div>
        </main>
      )}
    </Layout>
  );
}
