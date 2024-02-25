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
 * - `ExplicitBoundFunction<TFunction>`
 *   + An explicit bound function with parameters
 */
export function explicitBind<TFunction extends (...args: any[]) => any>(
  callable: TFunction,
  ...parameters: Parameters<TFunction>
): ExplicitBoundFunction<TFunction> {
  let result = () => callable(...parameters);
  const functionAndParameters = [callable, ...parameters] as const;
  result = Object.assign(result, functionAndParameters);
  result = Object.assign(result, {
    [Symbol.iterator]: () => functionAndParameters.values(),
  });
  return result as ExplicitBoundFunction<TFunction>;
}

/**
 * ## Introduction
 * An explicitly bound function.
 *
 * It is explicit in terms of the accessibility of the source function and parameters.
 *
 * ## Layout
 * - `Function`
 *   - `()`: `ReturnType<TFunction>`
 *     + Calls the bound function with parameters
 * - `ArrayLike`
 *   - `[0]`: `TFunction`
 *     + The source function to bind
 *   - `[number]`: `Parameters<TFunction>[number - 1]`
 *     + One of the bound parameters
 *     + `number` is an integer greater than `0`
 * - `Iterable<[TFunction, ...Parameters<TFunction>][number]>`
 *   + Iterates the source function and parameters
 */
export type ExplicitBoundFunction<TFunction extends (...args: any[]) => any> =
  (() => ReturnType<TFunction>) &
    readonly [TFunction, ...Parameters<TFunction>] &
    Iterable<[TFunction, ...Parameters<TFunction>][number]>;
