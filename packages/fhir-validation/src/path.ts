// See [https://datatracker.ietf.org/doc/html/rfc6901#section-3] for reference.
function escapeField(field: string) {
  return field.replace("~", "~0").replace("/", "~1");
}

function unescape(field: string) {
  return field.replace("~1", "/").replace("~0", "~");
}

export function descend(path: string, field: string | number) {
  return path + "/" + escapeField(field.toString());
}

export function ascend(
  path: string
): { parent: string; field: string } | undefined {
  const last = path.lastIndexOf("/");
  const parent = path.substring(0, last);
  if (!parent) return undefined;
  const field = unescape(path.substring(last + 1));
  return { parent, field };
}

export function createPath(...fields: string[]) {
  return fields.reduce((acc, field) => descend(acc, field), "");
}
