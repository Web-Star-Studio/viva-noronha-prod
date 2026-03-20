/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "convex/_generated/api" {
  export const api: any;
}

declare module "*convex/_generated/api" {
  export const api: any;
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
