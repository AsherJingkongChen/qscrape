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

describe('Queue.prototype[Symbol.iterator]()', () => {
  it('It iterates through the queue', () => {
    expect([...new Queue([1, 2, 3])]).toEqual([1, 2, 3]);
  });

  it('It returns nothing if the queue is empty or iterated', () => {
    expect([...new Queue()]).toEqual([]);

    const queue = new Queue([1, 2, 3]);
    expect([...queue]).toEqual([1, 2, 3]);
    expect([...queue]).toEqual([]);
  });

  it('Its yielded elements are affected by any other operation', () => {
    const queue = new Queue([1, 2, 3, 4]);
    let received = new Array<number>();
    for (const element of queue) {
      received.push(element);
      queue.poll();
    }
    expect(received).toEqual([1, 3]);
    expect(queue.poll()).toBeUndefined();

    queue.push(5, 6, 7);
    received = [];
    for (const element of queue) {
      received.push(element);
      if (element === 5) {
        queue.push(8);
      }
    }
    expect(received).toEqual([5, 6, 7, 8]);
  });
});
