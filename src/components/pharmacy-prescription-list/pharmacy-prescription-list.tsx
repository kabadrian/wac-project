import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { PrescriptionsApiFactory, Prescription, Medicine } from '../../api/pharmacy-pl';

@Component({
  tag: 'pharmacy-prescription-list',
  styleUrl: 'pharmacy-prescription-list.css',
  shadow: true,
})
export class PharmacyPrescriptionList {

  medicinePrescriptions: Prescription[] = [];

  @Event({ eventName: "entry-clicked" }) entryClicked: EventEmitter<string>;
  @Prop() apiBase: string;
  @Prop() ambulanceId: string;
  @State() errorMessage: string;

  private async getMedicinePrescriptionsAsync(): Promise<Prescription[]> {
    try {
      const response = await
      PrescriptionsApiFactory(undefined, this.apiBase).
          getAmbulancePrescriptions(this.ambulanceId)
      console.log("response");
      if (response.status < 299) {
        return response.data;
      } else {
        this.errorMessage = `Cannot retrieve list of prescriptions from this ambulance: ${response.statusText}`
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve list of prescriptions from this ambulance: ${err.message || "unknown"}`
    }
    return [];
  }

  render() {
    return (
      <Host>
        {this.errorMessage
          ? <div class="error">{this.errorMessage}</div>
          :
          <div>
          <md-list>
            {this.medicinePrescriptions.map(prescription =>
              <md-list-item class="prescription-item" onClick={ () => this.entryClicked.emit(prescription.id)}>
                <div slot="headline">{prescription.patientName}</div>
                <div slot="supporting-text">{"Čas predpísania receptu: " + this.isoDateToLocale(prescription.issuedDate)}</div>
                <div slot="supporting-text">{"Recept platný do: " + this.isoDateToLocale(prescription.validUntil)}</div>
                <div slot="supporting-text">
                  <p>Predpísané lieky:</p>
                  <ul>
                    {prescription.medicines.map((medicine: Medicine) => (
                      <li>
                        <p>{medicine.name}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <md-icon slot="start">receipt_long</md-icon>
              </md-list-item>
            )}
          </md-list>
          <div class="left-button-container">
            <md-filled-button onClick={() => this.entryClicked.emit("@new")}>
              <md-icon slot="icon">add</md-icon> Add
            </md-filled-button>
          </div>
          </div>
        }
      </Host>
    );
  }

  async componentWillLoad() {
    this.medicinePrescriptions = await this.getMedicinePrescriptionsAsync();
  }

  private isoDateToLocale(iso:string) {
    if(!iso) return '';
    return new Date(Date.parse(iso)).toLocaleString()
  }

}
