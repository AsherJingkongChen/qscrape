/**
 * ## Introduction
 * Binds a function explicitly
 *
 * ## Parameters
 * - `callable`: `TFunction`
 *   + A function to bind
 * - `...parameters`: `Parameters<TFunction>`
 *   + Parameters to bind
 *
 * ## Returns
 * - `ExplicitFunction<TFunction>`
 *   + An explicit bound function which is also an array-like object
 */
export function explicitBind<TFunction extends (...args: any[]) => any>(
  callable: TFunction,
  ...parameters: Parameters<TFunction>
): ExplicitFunction<TFunction> {
  return Object.assign(() => callable(...parameters), [
    callable,
    ...parameters,
  ] as const);
}

/**
 * ## Introduction
 * An explicitly bound function
 *
 * ## Layout
 * - `()`: `ReturnType<TFunction>`
 *   + Calls the bound function with parameters
 * - `[0]`: `TFunction`
 *   + The source function to bind
 * - `[number]`: `Parameters<TFunction>[number - 1]`
 *   + One of the bound parameters
 *   + `number` is an integer greater than `0`
 */
export type ExplicitFunction<TFunction extends (...args: any[]) => any> =
  (() => ReturnType<TFunction>) &
    readonly [TFunction, ...Parameters<TFunction>];
