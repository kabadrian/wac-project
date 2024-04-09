import { Component, Host, Prop, State, h, EventEmitter, Event } from '@stencil/core';
import { Prescription, PrescriptionsApiFactory } from '../../api/pharmacy-pl';

@Component({
  tag: 'pharmacy-prescription-editor',
  styleUrl: 'pharmacy-prescription-editor.css',
  shadow: true,
})
export class PharmacyPrescriptionEditor {

  @Prop() entryId: string;
  @Prop() ambulanceId: string;
  @Prop() apiBase: string;

  @Event({eventName: "editor-closed"}) editorClosed: EventEmitter<string>;

  @State() entry: Prescription;
  @State() errorMessage:string;
  @State() isValid: boolean;

  private formElement: HTMLFormElement;

  private async getPrescriptionEntryAsync(): Promise<Prescription> {
    if ( !this.entryId ) {
       this.isValid = false;
       return undefined
    }
    try {
       const response
           = await PrescriptionsApiFactory(undefined, this.apiBase)
             .getPrescriptionById(this.ambulanceId, this.entryId)

       if (response.status < 299) {
          this.entry = response.data;
          this.isValid = true;
       } else {
          this.errorMessage = `Cannot retrieve list of prescriptions: ${response.statusText}`
       }
    } catch (err: any) {
       this.errorMessage = `Cannot retrieve list of prescriptions: ${err.message || "unknown"}`
    }
    return undefined;
 }

  async componentWillLoad() {
    this.getPrescriptionEntryAsync();
  }


  render() {
    if(this.errorMessage) {
      return (
      <Host>
         <div class="error">{this.errorMessage}</div>
      </Host>
      )
   }
    return (
      <Host>
        <form ref={el => this.formElement = el}>
          <md-filled-text-field label="Meno a Priezvisko" 
              required value={this.entry?.patientName}
              oninput={ (ev: InputEvent) => {
                  if(this.entry) {this.entry.patientName = this.handleInputEvent(ev)}
              } }>
            <md-icon slot="leading-icon">person</md-icon>
          </md-filled-text-field>
  
          <md-filled-text-field label="Meno doktora"
            required value={this.entry?.doctorName}
            oninput={ (ev: InputEvent) => {
                if(this.entry) {this.entry.doctorName = this.handleInputEvent(ev)}
            } }>
            <md-icon slot="leading-icon">fingerprint</md-icon>
          </md-filled-text-field>
  
          <md-filled-text-field label="Datum predpisu" disabled
            value={this.entry?.issuedDate}>
            <md-icon slot="leading-icon">watch_later</md-icon>
          </md-filled-text-field>
  
          {/* <md-filled-select label="Dĺžka platnosti receptu"
            value={this.entry?.validUntil}
            oninput = { (ev: InputEvent) => {
              if(this.entry) {this.entry.validUntil = this.handleInputEvent(ev)}
            } }>
            <md-icon slot="leading-icon">sick</md-icon>
            <md-select-option value="folowup">
              <div slot="headline">Kontrola</div>
            </md-select-option>
            <md-select-option value="nausea">
              <div slot="headline">Nevoľnosť</div>
            </md-select-option>
            <md-select-option value="fever">
              <div slot="headline">Horúčka</div>
            </md-select-option>
            <md-select-option value="ache-in-throat">
              <div slot="headline">Bolesti hrdla</div>
            </md-select-option>
          </md-filled-select> */}

          
          <md-divider></md-divider>
          <div class="actions">
            <md-filled-tonal-button id="delete" disabled={ !this.entry }
              onClick={() => this.deleteEntry()} >
              <md-icon slot="icon">delete</md-icon>
              Zmazať
            </md-filled-tonal-button>
            <span class="stretch-fill"></span>
            <md-outlined-button id="cancel"
              onClick={() => this.editorClosed.emit("cancel")}>
              Zrušiť
            </md-outlined-button>
            <md-filled-button id="confirm" disabled={ !this.isValid }
            onClick={() => this.updateEntry() }
            >
            <md-icon slot="icon">save</md-icon>
            Uložiť
          </md-filled-button>
          </div>
        </form>
      </Host>
    );
  }

  private handleInputEvent( ev: InputEvent): string {
    const target = ev.target as HTMLInputElement;
    // check validity of elements
    this.isValid = true;
    for (let i = 0; i < this.formElement.children.length; i++) {
       const element = this.formElement.children[i]
       if ("reportValidity" in element) {
       const valid = (element as HTMLInputElement).reportValidity();
       this.isValid &&= valid;
       }
    }
    return target.value
 }

 private async updateEntry() {
  try {
      const response = await PrescriptionsApiFactory(undefined, this.apiBase)
        .updatePrescription(this.ambulanceId, this.entryId, this.entry)
      if (response.status < 299) {
        this.editorClosed.emit("store")
      } else {
        this.errorMessage = `Cannot store entry: ${response.statusText}`
      }
    } catch (err: any) {
      this.errorMessage = `Cannot store entry: ${err.message || "unknown"}`
    }
  }

  private async deleteEntry() {
    try {
       const response = await PrescriptionsApiFactory(undefined, this.apiBase)
          .deletePrescription(this.ambulanceId, this.entryId)
       if (response.status < 299) {
       this.editorClosed.emit("delete")
       } else {
       this.errorMessage = `Cannot delete entry: ${response.statusText}`
       }
    } catch (err: any) {
       this.errorMessage = `Cannot delete entry: ${err.message || "unknown"}`
    }
 }
}
