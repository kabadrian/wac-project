import { newSpecPage } from '@stencil/core/testing';
import { EmployeePrescriptionList } from '../employee-prescription-list';

describe('employee-prescription-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [EmployeePrescriptionList],
      html: `<employee-prescription-list></employee-prescription-list>`,
    });
    expect(page.root).toEqualHtml(`
      <employee-prescription-list>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </employee-prescription-list>
    `);
  });
});
