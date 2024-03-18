import { Component, Host, h } from '@stencil/core';
import '@material/web/list/list'
import '@material/web/list/list-item'
import '@material/web/icon/icon'

@Component({
  tag: 'pharmacy-prescription-list',
  styleUrl: 'pharmacy-prescription-list.css',
  shadow: true,
})
export class PharmacyPrescriptionList {

  drugPrescriptions: any[];

  private async getDrugPrescriptionsAsync(){
    return await Promise.resolve(
      [{
          patientName: 'Jožko Púčik',
          patientId: '10001',
          createdAt: (new Date(Date.now())).toISOString(),
          validUntil: (new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).toISOString(),
          prescriptedDrugs: [{
              name: 'Paralen',
              amount: 20,
              unit: 'tbl',
              dosage: '1x denne',
              note: 'Po jedle',
              pickedUpAt: new Date(Date.now()).toISOString(),
          }, {
              name: 'Ibalgin',
              amount: 10,
              unit: 'tbl',
              dosage: '1x denne',
              note: 'Po jedle',
              pickedUpAt: null,
          }]
      }, {
          patientName: 'Janko Hraško',
          patientId: '10002',
          createdAt: (new Date(Date.now())).toISOString(),
          validUntil: (new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).toISOString(),
          prescriptedDrugs: [{
              name: 'Paralen',
              amount: 1,
              unit: 'tbl',
              dosage: '1x denne',
              note: 'Po jedle',
              pickedUpAt: new Date(Date.now()).toISOString(),
            }, {
              name: 'Ibalgin',
              amount: 3,
              unit: 'tbl',
              dosage: '2x denne',
              note: 'Po jedle',
              pickedUpAt: null,
            }]
      }]
    );
  }

  render() {
    return (
      <Host>
       <md-list>
          {this.drugPrescriptions.map(prescription =>
            <md-list-item class="prescription-item">
              <div slot="headline">{prescription.patientName}</div>
              <div slot="supporting-text">{"Čas predpísania receptu: " + this.isoDateToLocale(prescription.createdAt)}</div>
              <div slot="supporting-text">{"Recept platný do: " + this.isoDateToLocale(prescription.validUntil)}</div>
              <md-icon slot="start">receipt_long</md-icon>
            </md-list-item>
          )}
        </md-list>
      </Host>
    );
  }

  async componentWillLoad() {
    this.drugPrescriptions = await this.getDrugPrescriptionsAsync();
  }

  private isoDateToLocale(iso:string) {
    if(!iso) return '';
    return new Date(Date.parse(iso)).toLocaleString()
  }

}
