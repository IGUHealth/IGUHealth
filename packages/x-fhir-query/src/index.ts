import { evaluate } from "@iguhealth/fhirpath";

const EXPRESSION_REGEX = new RegExp("{{([^}]*)}}");

export default function execute(
  xfhirQuery: string,
  fpOptions: Parameters<typeof evaluate>[2],
): string {
  let output = xfhirQuery;
  while (EXPRESSION_REGEX.test(output)) {
    const result = output.match(EXPRESSION_REGEX);
    const expression = result?.[1];
    const match = result?.[0];
    if (!match || !expression) {
      throw new Error("Invalid expression");
    }

    const evaluation = evaluate(expression, undefined, fpOptions)
      .map((e) => e.toString())
      .join(",");
    output = output.replace(match, evaluation);
  }

  return output;
}
