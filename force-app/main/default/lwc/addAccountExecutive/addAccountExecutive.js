import { LightningElement } from "lwc";

export default class AddAccountExecutive extends LightningElement {
  handleGoBack() {
    this.dispatchEvent(new CustomEvent("backtocontact"));
  }
  addAccountExecutive() {}
}
