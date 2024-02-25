import { render } from '@inquirer/testing';
import { QScrape } from 'src/feat';
import { describe, expect, it } from 'vitest';

describe('QScrape.prompts.confirmation()', () => {
  it('It has a default answer', async () => {
    const [prompt, props, options] = QScrape.prompts.confirmation();
    const { answer, events } = await render(prompt, props, options);
    events.keypress('enter');
    await expect(answer).resolves.toBeTypeOf('boolean');
  });
});

describe('QScrape.prompts.referenceLink()', () => {
  it('It has a default answer', async () => {
    const [prompt, props, options] = QScrape.prompts.referenceLink();
    const { answer, events, getScreen } = await render(prompt, props, options);
    console.log(getScreen());
    events.keypress('enter');
    console.log(getScreen());

    await Promise.resolve();
    console.log(getScreen());

    await expect(answer).resolves.toBeTypeOf('string');
  });

  // it('It validates the input', async () => {
  //   const [prompt, props, options] = QScrape.prompts.referenceLink('examplecom');
  //   const { answer, events } = await render(prompt, props, options);
  //   events.keypress('enter');
  //   await expect(answer).resolves.toBe(false);
  // });
});

describe('QScrape.prompts.referenceName()', () => {
  it('It has a default answer', async () => {
    const [prompt, props, options] = QScrape.prompts.referenceName();
    const { answer, events } = await render(prompt, props, options);
    events.keypress('enter');
    await expect(answer).resolves.toBeTypeOf('string');
  });
});
