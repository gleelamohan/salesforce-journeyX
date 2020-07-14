import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
export default class AddContacts extends LightningElement {
  @api accountId;
  loadContacts = false;
  handleSuccess(event) {
    if (!this.loadContacts) {
      this.loadContacts = true;
    } else {
      this.template.querySelector("c-display-contacts").reloadContactData();
    }

    this.showToast();
    this.resetForm();
  }
  errorCallback(error, stack) {
    console.log(error, stack);
  }
  handleSubmit(event) {
    event.preventDefault(); // stop the form from submitting
    const fields = event.detail.fields;
    fields.Account__c = this.accountId;
    this.template.querySelector("lightning-record-edit-form").submit(fields);
  }
  showToast() {
    const event = new ShowToastEvent({
      title: "Success!",
      variant: "success",
      message: "Contact Added successfully."
    });
    this.dispatchEvent(event);
  }
  resetForm() {
    const inputFields = this.template.querySelectorAll("lightning-input-field");
    if (inputFields) {
      inputFields.forEach((field) => {
        field.reset();
      });
    }
  }
}
