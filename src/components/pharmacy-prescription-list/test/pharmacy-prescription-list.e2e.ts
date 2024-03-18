import { newE2EPage } from '@stencil/core/testing';

describe('pharmacy-prescription-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pharmacy-prescription-list></pharmacy-prescription-list>');

    const element = await page.find('pharmacy-prescription-list');
    expect(element).toHaveClass('hydrated');
  });
});
