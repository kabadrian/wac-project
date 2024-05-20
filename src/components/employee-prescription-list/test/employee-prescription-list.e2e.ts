import { newE2EPage } from '@stencil/core/testing';

describe('employee-prescription-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<employee-prescription-list></employee-prescription-list>');

    const element = await page.find('employee-prescription-list');
    expect(element).toHaveClass('hydrated');
  });
});
