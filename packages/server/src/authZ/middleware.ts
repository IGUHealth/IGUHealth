import Koa from "koa";

export async function canUserAccessWorkspaceMiddleware(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>,
  next: Koa.Next
) {
  if (!ctx.params.workspace) {
    ctx.throw(400, "workspace is required");
  }
  if (
    !ctx.state.user["https://iguhealth.app/workspaces"]?.includes(
      ctx.params.workspace
    )
  ) {
    ctx.throw(
      403,
      `User is not authorized to access workspace ${ctx.params.workspace}`
    );
  }
  return next();
}
