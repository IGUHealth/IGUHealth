type ReturnTypeToArgument<InitialArgs, ReturnTypes extends any[]> = Extract<
  [[args: InitialArgs], ...{ [I in keyof ReturnTypes]: [arg: ReturnTypes[I]] }],
  Record<keyof ReturnTypes, any>
>;
type DeriveFunctionSignatures<InitialArgs, T extends any[]> = {
  [I in keyof T]: (
    ...args: Extract<ReturnTypeToArgument<InitialArgs, T>[I], any[]>
  ) => T[I];
};
type LastReturnType<T extends any[]> = T extends [...infer _, infer L]
  ? L
  : never;

export default function CreateChain<InitialArgs extends any, T extends any[]>(
  fns: [...DeriveFunctionSignatures<InitialArgs, T>]
): (args: InitialArgs) => LastReturnType<T>;
export default function CreateChain(funcs: ((...args: any) => any)[]) {
  const [f0, ...fs] = funcs;
  return (args: any[]) => fs.reduce((a, f) => f(a), f0(args));
}
