import { newSpecPage } from '@stencil/core/testing';
import { PharmacyPrescriptionEditor } from '../pharmacy-prescription-editor';

describe('pharmacy-prescription-editor', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PharmacyPrescriptionEditor],
      html: `<pharmacy-prescription-editor></pharmacy-prescription-editor>`,
    });
    expect(page.root).toEqualHtml(`
      <pharmacy-prescription-editor>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pharmacy-prescription-editor>
    `);
  });
});
