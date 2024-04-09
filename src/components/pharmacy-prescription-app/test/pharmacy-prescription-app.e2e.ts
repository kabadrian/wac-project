import { newE2EPage } from '@stencil/core/testing';

describe('pharmacy-prescription-app', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pharmacy-prescription-app></pharmacy-prescription-app>');

    const element = await page.find('pharmacy-prescription-app');
    expect(element).toHaveClass('hydrated');
  });
});
