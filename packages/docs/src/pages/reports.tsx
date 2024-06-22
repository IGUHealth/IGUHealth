import Layout from "@theme/Layout";
import React, { useEffect, useMemo, useState } from "react";

import { R4, Resource } from "@iguhealth/fhir-types/version";

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

        <h1>{testScript.id}</h1>

        <div>
          <div>
            <h3>Fixtures</h3>
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

          <div>
            <h3>Tests</h3>
            {testScript.test?.map((test, ti) => (
              <div>
                <h4>{test.name}</h4>
                {test.action.map((action, actionIndex) => {
                  if (action.operation) {
                    return (
                      <div>
                        <div className="flex items-center mb-2">
                          <div className="flex flex-1 mr-2">
                            <span className="text-lg font-semibold">
                              Operation
                            </span>
                          </div>
                          <div
                            className={`p-1 ${testReport.test[ti].action[actionIndex].operation.result === "pass" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                          >
                            {
                              testReport.test[ti].action[actionIndex].operation
                                .result
                            }
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
                            <span className="text-lg font-semibold">
                              Assertion
                            </span>
                          </div>
                          <div
                            className={`p-1 ${testReport.test[ti].action[actionIndex].assert.result === "pass" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                          >
                            {
                              testReport.test[ti].action[actionIndex].assert
                                .result
                            }
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
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function RenderReports() {
  const [bundle, setBundle] = useState<Resource<R4, "Bundle"> | undefined>(
    undefined,
  );

  const [context, setContext] = useState<
    | {
        testScript: Resource<R4, "TestScript">;
        testReport: Resource<R4, "TestReport">;
      }
    | undefined
  >(undefined);

  useEffect(() => {
    fetch("https://iguhealth.app/testscripts/reports.json")
      .then((res) => res.json())
      .then(setBundle)
      .catch(console.error);
  }, []);

  const testScripts: Resource<R4, "TestScript">[] = useMemo(() => {
    return (
      bundle?.entry
        ?.map((entry) => entry.resource)
        .filter((r) => r.resourceType === "TestScript") ?? []
    );
  }, [bundle]);

  const testReports: Resource<R4, "TestReport">[] = useMemo(() => {
    return (
      bundle?.entry
        ?.map((entry) => entry.resource)
        .filter((r) => r.resourceType === "TestReport") ?? []
    );
  }, [bundle]);

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
                <th className="w-[100%]">Test Suite</th>
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
