import jsonpointer from "jsonpointer";

import { AResource, ResourceType, id } from "@iguhealth/fhir-types/r4/types";

// Parent Loc
declare const __parent: unique symbol;
declare const __root: unique symbol;
type _Loc<B, T> = { [__root]: (root: B) => T };
type Parent<B> = Loc<B, unknown, any> | null;

export type Loc<
  B,
  T,
  P extends Loc<B, unknown, Parent<B>> | null = null
> = string & _Loc<B, T> & { [__parent]: P };

/*
 ** Access field in potentially Nullable V
 ** If V is nullable then set the return type to potentially nullable as well.
 */
type NullGuard<V, Field extends keyof NonNullable<V>> = V extends NonNullable<V>
  ? NonNullable<V>[Field]
  : NonNullable<V>[Field] | undefined;

/*
 ** Descend Loc pointer with field.
 */
export function descend<
  T,
  R,
  P extends Parent<T>,
  Field extends keyof NonNullable<R>
>(loc: Loc<T, R, P>, field: Field): Loc<T, NullGuard<R, Field>, typeof loc> {
  return `${loc}/${String(field)}` as Loc<T, NullGuard<R, Field>, typeof loc>;
}

type ReturnType<L> = L extends Loc<infer B, infer T, infer P> ? T : any;

/*
 ** Ascend Loc pointer to parent.
 */
export function ascend<T, R, P extends Parent<T>>(
  loc: Loc<T, R, P>
): { parent: P; field: NonNullable<keyof ReturnType<P>> } | undefined {
  // At root so return undefined.
  const lastIndexSlash = loc.lastIndexOf("/");
  if (lastIndexSlash === -1) return undefined;
  const field = loc.substring(lastIndexSlash + 1);
  return {
    parent: loc.slice(0, lastIndexSlash) as P,
    field: Number.isNaN(parseInt(field))
      ? field
      : (parseInt(field) as keyof NonNullable<ReturnType<P>>),
  };
}

export function toJSONPointer<T, R, P extends Parent<T>>(loc: Loc<T, R, P>) {
  return loc.substring(loc.indexOf("/"), loc.length);
}

export function pathMeta<T, R, P extends Parent<T>>(
  loc: Loc<T, R, P>
): { resourceType: ResourceType; id: id } {
  const [resourceType, id] = loc.substring(0, loc.indexOf("/")).split("|");
  return { resourceType: resourceType as ResourceType, id };
}

export function get<T extends object, R, P extends Parent<T>>(
  loc: Loc<T, R, P>,
  v: T
): R {
  return jsonpointer.get(v, toJSONPointer(loc)) as R;
}

/*
 ** Creates a Loc pointer for a resource.
 */
export function pointer<T extends ResourceType>(
  resourceType: T,
  resourceId: id
): Loc<AResource<T>, AResource<T>> {
  return `${resourceType}|${resourceId}` as Loc<AResource<T>, AResource<T>>;
}
