import { newSpecPage } from '@stencil/core/testing';
import { PharmacyPrescriptionList } from '../pharmacy-prescription-list';

describe('pharmacy-prescription-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PharmacyPrescriptionList],
      html: `<pharmacy-prescription-list></pharmacy-prescription-list>`,
    });
    expect(page.root).toEqualHtml(`
      <pharmacy-prescription-list>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pharmacy-prescription-list>
    `);
  });
});
