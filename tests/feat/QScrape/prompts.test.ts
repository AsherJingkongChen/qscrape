import { render } from '@inquirer/testing';
import { QScrape } from 'src/feat';
import { inspect } from 'util';
import { describe, expect, it } from 'vitest';

describe('QScrape.prompts.confirmation()', () => {
  it('It has a default answer', async () => {
    const [prompt, props] = QScrape.prompts.confirmation();
    const { answer, events } = await render(prompt, props);
    events.keypress('enter');
    await expect(answer).resolves.toBeTypeOf('boolean');
  });
});

describe('QScrape.prompts.referenceLink()', () => {
  it('It has a default answer', async () => {
    const [prompt, props] = QScrape.prompts.referenceLink();
    const { answer, events } = await render(prompt, props);
    events.keypress('enter');
    await expect(answer).resolves.toBeTypeOf('string');
  });

  it('It validates the input', async () => {
    const [prompt, props] = QScrape.prompts.referenceLink();
    const { answer, events } = await render(prompt, props);
    events.type('f');
    events.keypress('enter');
    expect(inspect(answer)).toContain('pending');

    // Wait for the next tick
    await Promise.resolve();

    events.keypress('backspace');
    events.keypress('backspace');
    events.type('https://about.google/commitments/');
    events.keypress('enter');
    await expect(answer).resolves.toBeTypeOf('string');
  });
});

describe('QScrape.prompts.referenceName()', () => {
  it('It has a default answer', async () => {
    const [prompt, props] = QScrape.prompts.referenceName();
    const { answer, events } = await render(prompt, props);
    events.keypress('enter');
    await expect(answer).resolves.toBeTypeOf('string');
  });
});
