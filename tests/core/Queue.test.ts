import { Queue } from 'src/core';
import { describe, expect, it } from 'vitest';

describe('Queue', () => {
  it('It follows the FIFO principle', () => {
    const queue = new Queue();
    queue.push(1);
    queue.push(3);
    queue.push(2);
    expect(queue.poll()).toBe(1);
    expect(queue.poll()).toBe(3);
    queue.push(0);
    expect(queue.poll()).toBe(2);
    expect(queue.poll()).toBe(0);
    queue.push(-1);
    expect(queue.poll()).toBe(-1);
    expect(queue.poll()).toBeUndefined();
  });
});

describe('new Queue()', () => {
  it('It creates a queue from an iterable', () => {
    const queue = new Queue([1, 2, 3]);
    expect(queue.poll()).toBe(1);
    expect(queue.poll()).toBe(2);
    expect(queue.poll()).toBe(3);
    expect(queue.poll()).toBeUndefined();
  });
});

describe('Queue.prototype.poll()', () => {
  it('It returns `undefined` if the queue is empty', () => {
    const queue = new Queue();
    expect(queue.poll()).toBeUndefined();
    expect(queue.poll()).toBeUndefined();
  });
});
