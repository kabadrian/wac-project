import { newSpecPage } from '@stencil/core/testing';
import { PharmacyPrescriptionList } from '../pharmacy-prescription-list';

describe('pharmacy-prescription-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PharmacyPrescriptionList],
      html: `<pharmacy-prescription-list></pharmacy-prescription-list>`,
    });

    const wlList = page.rootInstance as PharmacyPrescriptionList;
   const expectedPatients = wlList?.drugPrescriptions?.length

    const items = page.root.shadowRoot.querySelectorAll("md-list-item");
    expect(items.length).toEqual(expectedPatients);
  });
});
