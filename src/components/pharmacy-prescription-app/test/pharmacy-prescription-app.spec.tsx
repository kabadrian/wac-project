import { newSpecPage } from '@stencil/core/testing';
import { PharmacyPrescriptionApp } from '../pharmacy-prescription-app';

describe('pharmacy-prescription-app', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PharmacyPrescriptionApp],
      html: `<pharmacy-prescription-app></pharmacy-prescription-app>`,
    });
    expect(page.root).toEqualHtml(`
      <pharmacy-prescription-app>
        <mock:shadow-root>
          <pharmacy-prescription-list></pharmacy-prescription-list>
        </mock:shadow-root>
      </pharmacy-prescription-app>
    `);
  });
});
