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
          <form>
            <md-filled-text-field label="Meno a Priezvisko" required="">
              <md-icon slot="leading-icon">
                person
              </md-icon>
            </md-filled-text-field>
            <md-filled-text-field label="Meno doktora" required="">
              <md-icon slot="leading-icon">
                fingerprint
              </md-icon>
            </md-filled-text-field>
            <md-filled-text-field disabled="" label="Datum predpisu">
              <md-icon slot="leading-icon">
                watch_later
              </md-icon>
            </md-filled-text-field>
            <md-divider></md-divider>
            <div class="actions">
              <md-filled-tonal-button disabled="" id="delete">
                <md-icon slot="icon">
                  delete
                </md-icon>
                Zmazať
              </md-filled-tonal-button>
              <span class="stretch-fill"></span>
              <md-outlined-button id="cancel">
                Zrušiť
              </md-outlined-button>
              <md-filled-button disabled="" id="confirm">
                <md-icon slot="icon">
                  save
                </md-icon>
                Uložiť
              </md-filled-button>
            </div>
          </form>
        </mock:shadow-root>
      </pharmacy-prescription-editor>
    `);
  });
});
