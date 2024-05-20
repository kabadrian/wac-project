import { Component, Host, Prop, State, h, EventEmitter, Event } from '@stencil/core';
import { Prescription, PrescriptionsApiFactory } from '../../api/pharmacy-pl';

@Component({
  tag: 'employee-prescription-editor',
  styleUrl: 'employee-prescription-editor.css',
  shadow: true,
})
export class EmployeePrescriptionEditor {

  @Prop() entryId: string;
  @Prop() ambulanceId: string;
  @Prop() apiBase: string;

  @Event({ eventName: "editor-closed" }) editorClosed: EventEmitter<string>;

  @State() entry: Prescription;
  @State() errorMessage: string;
  @State() isValid: boolean;
  @State() showModal: boolean = false;
  @State() medicinesList: string[] = [];
  @State() selectedMedicine: string = '';

  private formElement: HTMLFormElement;

  private availableMedicines: string[] = ["Aspirin", "Ibuprofen", "Amoxicillin", "Metformin", "Lisinopril"];

  private async getPrescriptionEntryAsync(): Promise<Prescription> {
    if (!this.entryId) {
      this.isValid = false;
      return undefined;
    }
    try {
      const response = await PrescriptionsApiFactory(undefined, this.apiBase)
        .getPrescriptionById(this.ambulanceId, this.entryId);

      if (response.status < 299) {
        this.entry = response.data;
        this.isValid = true;
      } else {
        this.errorMessage = `Cannot retrieve list of prescriptions: ${response.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve list of prescriptions: ${err.message || "unknown"}`;
    }
    return undefined;
  }

  async componentWillLoad() {
    this.getPrescriptionEntryAsync();
  }

  handleInputEvent(ev: InputEvent): string {
    const target = ev.target as HTMLInputElement;
    this.isValid = this.formElement.checkValidity();
    return target.value;
  }

  addMedicineToList() {
    if (this.selectedMedicine) {
      this.medicinesList = [
        ...this.medicinesList,
        this.selectedMedicine
      ];
      this.showModal = false;
      this.selectedMedicine = '';
    }
  }

  removeMedicine(index: number) {
    this.medicinesList = this.medicinesList.filter((_, i) => i !== index);
  }

  async updateEntry() {
    try {
      const response = await PrescriptionsApiFactory(undefined, this.apiBase)
        .updatePrescription(this.ambulanceId, this.entryId, this.entry);
      if (response.status < 299) {
        this.editorClosed.emit("store");
      } else {
        this.errorMessage = `Cannot store entry: ${response.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot store entry: ${err.message || "unknown"}`;
    }
  }

  async deleteEntry() {
    try {
      const response = await PrescriptionsApiFactory(undefined, this.apiBase)
        .deletePrescription(this.ambulanceId, this.entryId);
      if (response.status < 299) {
        this.editorClosed.emit("delete");
      } else {
        this.errorMessage = `Cannot delete entry: ${response.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot delete entry: ${err.message || "unknown"}`;
    }
  }

  render() {
    if (this.errorMessage) {
      return (
        <Host>
          <div class="error">{this.errorMessage}</div>
        </Host>
      );
    }
    return (
      <Host>
        <form ref={el => this.formElement = el}>
          <md-filled-text-field label="Meno a Priezvisko"
            required value={this.entry?.patientName}
            onInput={(ev: InputEvent) => {
              if (this.entry) { this.entry.patientName = this.handleInputEvent(ev) }
            }}>
            <md-icon slot="leading-icon">person</md-icon>
          </md-filled-text-field>

          <md-filled-text-field label="Meno doktora"
            required value={this.entry?.doctorName}
            onInput={(ev: InputEvent) => {
              if (this.entry) { this.entry.doctorName = this.handleInputEvent(ev) }
            }}>
            <md-icon slot="leading-icon">fingerprint</md-icon>
          </md-filled-text-field>

          <md-filled-text-field label="Datum predpisu" disabled
            value={this.entry?.issuedDate}>
            <md-icon slot="leading-icon">watch_later</md-icon>
          </md-filled-text-field>

          <md-filled-text-field label="Datum platnosti" disabled
            value={this.entry?.validUntil}>
            <md-icon slot="leading-icon">watch_later</md-icon>
          </md-filled-text-field>

          <md-filled-text-field label="Instructions">
            <textarea slot="input" value={this.entry?.instructions} onInput={(ev: InputEvent) => {
              if (this.entry) { this.entry.instructions = this.handleInputEvent(ev) }
            }}></textarea>
            <md-icon slot="leading-icon">description</md-icon>
          </md-filled-text-field>

          <md-filled-text-field label="Notes">
            <textarea slot="input" value={this.entry?.notes} onInput={(ev: InputEvent) => {
              if (this.entry) { this.entry.notes = this.handleInputEvent(ev) }
            }}></textarea>
            <md-icon slot="leading-icon">notes</md-icon>
          </md-filled-text-field>

          <md-divider></md-divider>

          <div class="medicine-list">
            {this.medicinesList.map((medicine, index) => (
              <div class="medicine-entry">
                <span class="medicine-name">{medicine}</span>
                <md-icon-button aria-label="Remove" onClick={() => this.removeMedicine(index)}>
                  <md-icon>delete</md-icon>
                </md-icon-button>
              </div>
            ))}
          </div>

          <md-filled-tonal-button onClick={() => this.showModal = true}>
            Add Medicine
          </md-filled-tonal-button>

          {this.showModal && (
            <div class="modal">
              <div class="modal-content">
                <h2>Add Medicine</h2>
                <md-filled-select label="Select Medicine" value={this.selectedMedicine} required onInput={(ev: Event) => this.selectedMedicine = (ev.target as HTMLSelectElement).value}>
                  {this.availableMedicines.map(medicine => (
                    <md-select-option value={medicine}>
                      <div slot="headline">{medicine}</div>
                    </md-select-option>
                  ))}
                </md-filled-select>
                <div class="modal-actions">
                  <md-filled-button onClick={() => this.addMedicineToList()}>
                    Add
                  </md-filled-button>
                  <md-outlined-button onClick={() => this.showModal = false}>
                    Cancel
                  </md-outlined-button>
                </div>
              </div>
            </div>
          )}

          <div class="actions">
            <md-filled-tonal-button id="delete" disabled={!this.entry}
              onClick={() => this.deleteEntry()}>
              <md-icon slot="icon">delete</md-icon>
              Zmazať
            </md-filled-tonal-button>
            <span class="stretch-fill"></span>
            <md-outlined-button id="cancel"
              onClick={() => this.editorClosed.emit("cancel")}>
              Zrušiť
            </md-outlined-button>
            <md-filled-button id="confirm" disabled={!this.isValid}
              onClick={() => this.updateEntry()}>
              <md-icon slot="icon">save</md-icon>
              Uložiť
            </md-filled-button>
          </div>
        </form>
      </Host>
    );
  }
}
