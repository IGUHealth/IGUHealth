import jsonpointer from "jsonpointer";

import {
  AResource,
  Resource,
  ResourceType,
  id,
} from "@iguhealth/fhir-types/r4/types";

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

// See [https://datatracker.ietf.org/doc/html/rfc6901#section-3] for reference.
function escapeField(field: string) {
  return field.replace("~", "~0").replace("/", "~1");
}

function unescapeField(field: string) {
  return field.replace("~1", "/").replace("~0", "~");
}

/*
 ** Descend Loc pointer with field.
 */
export function descend<
  T,
  R,
  P extends Parent<T>,
  Field extends keyof NonNullable<R>
>(loc: Loc<T, R, P>, field: Field): Loc<T, NullGuard<R, Field>, typeof loc> {
  return `${loc}/${escapeField(String(field))}` as Loc<
    T,
    NullGuard<R, Field>,
    typeof loc
  >;
}

type ReturnType<L> = L extends Loc<infer B, infer T, infer P> ? T : any;

/*
 ** Ascend Loc pointer to parent.
 */
export function ascend<T, R, P extends Parent<T>>(
  loc: Loc<T, R, P>
):
  | { parent: NonNullable<P>; field: NonNullable<keyof ReturnType<P>> }
  | undefined {
  // At root so return undefined.
  const lastIndexSlash = loc.lastIndexOf("/");
  if (lastIndexSlash === -1) return undefined;
  const field = unescapeField(loc.substring(lastIndexSlash + 1));
  return {
    parent: loc.slice(0, lastIndexSlash) as NonNullable<P>,
    field: Number.isNaN(parseInt(field))
      ? field
      : (parseInt(field) as keyof NonNullable<ReturnType<P>>),
  };
}

export function toJSONPointer<T, R, P extends Parent<T>>(loc: Loc<T, R, P>) {
  return loc.substring(loc.indexOf("/"), loc.length);
}

export function pathMeta<T extends Resource, R, P extends Parent<T>>(
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

export function fields<T extends object, R, P extends Parent<T>>(
  loc: Loc<T, R, P>
) {
  let asc = ascend(loc);
  let fields = [];
  while (asc) {
    fields.unshift(asc.field);
    asc = ascend(asc.parent);
  }
  return fields;
}

export function root<T extends Resource, R, P extends Parent<T>>(
  loc: Loc<T, R, P>
): Loc<T, T> {
  const { resourceType, id } = pathMeta(loc);
  return pointer(resourceType, id) as any as Loc<T, T>;
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

export function typedPointer<V, T>(path: string = ""): Loc<V, T, Parent<V>> {
  return path as Loc<V, T, Parent<V>>;
}
