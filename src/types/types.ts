// tRPC Utilities
export type RouteInput = import("@trpc/server").inferRouterInputs<
  import("../server/router/_app").AppRouter
>;
export type RouteOutput = import("@trpc/server").inferRouterOutputs<
  import("../server/router/_app").AppRouter
>;

export type ColorVariant =
  | "black"
  | "white"
  | "primary"
  | "secondary"
  | "warning"
  | "danger";

export type BaseVariant =
  | "default"
  | "error"
  | "warning"
  | "primary"
  | "secondary";

/**
 * Zod safe type: Caught, defaulted or both
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
export type ZodSafe<T extends import("zod").z.ZodType> =
  | T
  | import("zod").z.ZodCatch<T> // eslint-disable-line @typescript-eslint/consistent-type-imports
  | import("zod").z.ZodDefault<T> // eslint-disable-line @typescript-eslint/consistent-type-imports
  | import("zod").z.ZodCatch<import("zod").z.ZodDefault<T>> // eslint-disable-line @typescript-eslint/consistent-type-imports
  | import("zod").z.ZodDefault<import("zod").z.ZodCatch<T>>; // eslint-disable-line @typescript-eslint/consistent-type-imports

/**
 * Force a property in an object to be required. For example:
 *
 * RequiredProp<{ a?: "a", b?: "b", c: "c" }, "a"> => { a: "a", b?: "b", c: "c" }
 */
export type RequiredProp<T, RequiredKey extends keyof T> = Omit<
  T,
  RequiredKey
> &
  Required<{ [Key in RequiredKey]: NonNullable<T[Key]> }>;

/**
 * Utility type to extract the resolved value T
 * from a promise of type Promise<T> or an array of type Array<T>
 */
export type Unwrap<T> = T extends PromiseLike<infer U>
  ? U
  : T extends Array<infer U>
  ? U
  : T;
