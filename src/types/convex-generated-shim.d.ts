/**
 * Minimal type shim so the scoped tsconfig.typecheck.json can resolve
 * Convex-generated imports without pulling in the full Convex compilation.
 *
 * When the real generated files exist (after `bunx convex dev`), those
 * take precedence. These declarations are only a fallback for the scoped
 * typecheck that excludes convex/.
 */

declare module "convex/_generated/api" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const api: Record<string, any>;
  export { api };
}

declare module "*convex/_generated/api" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const api: Record<string, any>;
  export { api };
}

declare module "convex/_generated/dataModel" {
  export type Id<TableName extends string = string> = string & {
    readonly __tableName?: TableName;
  };
}

declare module "*convex/_generated/dataModel" {
  export type Id<TableName extends string = string> = string & {
    readonly __tableName?: TableName;
  };
}
