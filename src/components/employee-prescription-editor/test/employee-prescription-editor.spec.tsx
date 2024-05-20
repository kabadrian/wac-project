import { newSpecPage } from '@stencil/core/testing';
import { EmployeePrescriptionEditor } from '../employee-prescription-editor';

describe('employee-prescription-editor', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [EmployeePrescriptionEditor],
      html: `<employee-prescription-editor></employee-prescription-editor>`,
    });
    expect(page.root).toEqualHtml(`
      <employee-prescription-editor>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </employee-prescription-editor>
    `);
  });
});
