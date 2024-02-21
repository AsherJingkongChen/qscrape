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
   * Extract the earliest element from the queue
   *
   * ## Returns
   * - `TElement | undefined`
   *   + The earliest element
   *   + `undefined` if the queue is empty
   */
  poll(): TElement | undefined {
    return this.#buffer.shift();
  }

  /**
   * ## Introduction
   * Push new elements into the queue
   *
   * ## Parameters
   * - `...element`: `TElement[]`
   *   + The elements to push
   */
  push(...element: TElement[]): void {
    this.#buffer.push(...element);
  }

  /**
   * ## Introduction
   * Iterate through the queue
   *
   * ## Yields
   * - `TElement`
   *   + A element polled from the queue
   *
   * ## Note
   * - The yielded element is always in the order it were pushed
   * - Any other operations on the queue during iteration (e.g. `Queue.prototype.poll()`)
   *   may affect the yielded element but never invalidate the iterator
   */
  *[Symbol.iterator](): Generator<TElement> {
    for (let element; (element = this.poll()) !== undefined; yield element);
  }
}
