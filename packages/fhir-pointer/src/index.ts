import jsonpointer from "jsonpointer";

import { id } from "@iguhealth/fhir-types/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  R4,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";

// Parent Loc
declare const __parent: unique symbol;
declare const __root: unique symbol;
type _Loc<B, T> = { [__root]: (root: B) => T };
type Parent<B> = Loc<B, unknown, any> | null;

export type Loc<
  B,
  T,
  P extends Loc<B, unknown, Parent<B>> | null = null,
> = string & _Loc<B, T> & { [__parent]: P };

/*
 ** Access field in potentially Nullable V
 ** If V is nullable then set the return type to potentially nullable as well.
 */
type NullGuard<V, Field extends keyof NonNullable<V>> =
  V extends NonNullable<V>
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
  Field extends keyof NonNullable<R>,
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
  loc: Loc<T, R, P>,
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
  const indexOfLastSlash = loc.indexOf("/");
  if (indexOfLastSlash === -1) return "";
  return loc.substring(indexOfLastSlash, loc.length);
}

export function pathMeta<
  Version extends FHIR_VERSION,
  T extends Resource<Version, AllResourceTypes>,
  R,
  P extends Parent<T>,
>(loc: Loc<T, R, P>): { resourceType: ResourceType<Version>; id: id } {
  const indexOfLastSlash = loc.indexOf("/");
  const [resourceType, id] = loc
    .substring(0, indexOfLastSlash === -1 ? loc.length : indexOfLastSlash)
    .split("|");
  return { resourceType: resourceType as ResourceType<Version>, id: id as id };
}

export function get<T extends object, R, P extends Parent<T>>(
  loc: Loc<T, R, P>,
  v: T,
): R {
  return jsonpointer.get(v, toJSONPointer(loc)) as R;
}

export function fields<T extends object, R, P extends Parent<T>>(
  loc: Loc<T, R, P>,
) {
  let asc = ascend(loc);
  const fields = [];
  while (asc) {
    fields.unshift(asc.field);
    asc = ascend(asc.parent);
  }
  return fields;
}

export function root<
  Version extends FHIR_VERSION,
  T extends Resource<Version, AllResourceTypes>,
  R,
  P extends Parent<T>,
>(loc: Loc<T, R, P>): Loc<T, T> {
  const { resourceType, id } = pathMeta(loc);
  return pointer(resourceType, id) as any as Loc<T, T>;
}

function metaString<Version extends FHIR_VERSION>(
  resourceType: ResourceType<Version>,
  id: id,
) {
  return `${resourceType}|${id}`;
}

/*
 ** Creates a Loc pointer for a resource.
 */
export function pointer<
  Version extends FHIR_VERSION,
  T extends ResourceType<Version>,
>(
  resourceType: T,
  resourceId: id,
): Loc<Resource<Version, T>, Resource<Version, T>> {
  return `${metaString(resourceType, resourceId)}` as Loc<
    Resource<Version, T>,
    Resource<Version, T>
  >;
}

export function typedPointer<V, T>(): Loc<V, T, Parent<V>> {
  return metaString("Unknown" as ResourceType<R4>, "unknown" as id) as Loc<
    V,
    T,
    Parent<V>
  >;
}
