import { newE2EPage } from '@stencil/core/testing';

describe('pharmacy-prescription-editor', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pharmacy-prescription-editor></pharmacy-prescription-editor>');

    const element = await page.find('pharmacy-prescription-editor');
    expect(element).toHaveClass('hydrated');
  });
});
