import { newE2EPage } from '@stencil/core/testing';

describe('employee-prescription-editor', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<employee-prescription-editor></employee-prescription-editor>');

    const element = await page.find('employee-prescription-editor');
    expect(element).toHaveClass('hydrated');
  });
});
