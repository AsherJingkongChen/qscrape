/**
 * ## Introduction
 * A generic queue data structure,
 * which follows the First-In-First-Out (FIFO) principle,
 * where the first element added is the first one to be polled.
 *
 * ## Layout
 * - `Queue<TElement>`
 *   + `TElement` is the element type of the queue
 */
export class Queue<TElement> {
  /**
   * ## Introduction
   * The internal storage of elements
   */
  readonly #buffer: TElement[];

  /**
   * ## Introduction
   * Creates an empty queue
   */
  constructor();

  /**
   * ## Introduction
   * Creates a queue from an iterable
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
   * Extracts the earliest element from the queue
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
   * Pushes new elements into the queue
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
   * Iterates the queue
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
