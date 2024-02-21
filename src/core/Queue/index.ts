/**
 * ## Introduction
 * A generic queue data structure,
 * which follows the First-In-First-Out (FIFO) principle,
 * where the first element added is the first one to be polled.
 *
 * ## Layout
 * - `Queue<TElement>`
 *   + `TElement` is the type of elements in the queue
 */
export class Queue<TElement> {
  /**
   * ## Introduction
   * The internal storage that holds the elements
   */
  readonly #buffer: TElement[];

  /**
   * ## Introduction
   * Create an empty queue
   */
  constructor();

  /**
   * ## Introduction
   * Create a queue from an iterable
   *
   * ## Parameters
   * - `iterable`: `Iterable<TElement>`
   *   + An iterable
   */
  constructor(iterable: Iterable<TElement>);

  constructor(iterable?: Iterable<TElement>) {
    this.#buffer = iterable ? Array.from(iterable) : [];
  }

  /**
   * ## Introduction
   * Extract the earliest value from the queue
   *
   * ## Returns
   * - `TElement | undefined`
   *   + The earliest value
   *   + `undefined` if the queue is empty
   */
  poll(): TElement | undefined {
    return this.#buffer.shift();
  }

  /**
   * ## Introduction
   * Push a new value into the queue
   *
   * ## Parameters
   * - `value`: `TElement`
   *   + The value to push
   */
  push(value: TElement): void {
    this.#buffer.push(value);
  }
}
