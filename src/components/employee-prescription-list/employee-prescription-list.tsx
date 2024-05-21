import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { MedicineOrdersApiFactory } from '../../api/pharmacy-pl';

@Component({
  tag: 'employee-prescription-list',
  styleUrl: 'employee-prescription-list.css',
  shadow: true,
})
export class EmployeePrescriptionList {

  @Prop() apiBase: string;
  @Prop() ambulanceId: string;

  @State() orders: {
    orderId: string;
    orderedBy: string;
    orderDate: string;
    notes: string;
    medicines: { name: string }[];
  }[] = [];
  
  @State() errorMessage: string;

  @Event({ eventName: "entry-clicked" }) entryClicked: EventEmitter<string>;

  private async getOrdersAsync() {
    try {
      const response = await MedicineOrdersApiFactory(undefined, this.apiBase)
        .getAllMedicineOrders(this.ambulanceId); // Assuming the endpoint remains the same for now

      if (response.status < 299) {
        this.orders = response.data.map(order => ({
          orderId: order.orderId,
          orderDate: order.orderDate,
          orderedBy: order.orderedBy,
          notes: order.notes,
          medicines: order.medicines.map(medicine => ({ name: medicine.name }))
        }));
      } else {
        this.errorMessage = `Cannot retrieve list of orders: ${response.statusText}`;
      }
    } catch (err) {
      this.errorMessage = `Cannot retrieve list of orders: ${err.message || "unknown"}`;
    }
  }

  async componentWillLoad() {
    await this.getOrdersAsync();
  }

  private isoDateToLocale(iso: string) {
    if (!iso) return '';
    return new Date(Date.parse(iso)).toLocaleString();
  }

  render() {
    return (
      <Host>
        {this.errorMessage
          ? <div class="error">{this.errorMessage}</div>
          :
          <div>
          <md-list>
            {this.orders.map(order =>
              <md-list-item class="order-item" onClick={() => this.entryClicked.emit(order.orderId)}>
                <div slot="headline">{order.orderId}</div>
                <div slot="supporting-text">{"Order Date: " + this.isoDateToLocale(order.orderDate)}</div>
                <div slot="supporting-text">{"Ordered By: " + order.orderedBy}</div>
                <div slot="supporting-text">{"Notes: " + order.notes}</div>
                <div slot="supporting-text">
                  <p>Medicines:</p>
                  <ul>
                    {order.medicines.map(medicine => (
                      <li>{medicine.name}</li>
                    ))}
                  </ul>
                </div>
                <md-icon slot="start">receipt_long</md-icon>
              </md-list-item>
            )}
          </md-list>
          <div class="right-button-container">
            <md-filled-button onClick={() => this.entryClicked.emit("@new")}>
              <md-icon slot="icon">add</md-icon> Add
            </md-filled-button>
          </div>
        </div>
        }
      </Host>
    );
  }
}
