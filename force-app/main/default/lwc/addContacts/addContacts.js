import { LightningElement, api, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getContactList from "@salesforce/apex/XP_ContactController.fetchContacts";
export default class AddContacts extends LightningElement {
  @api accountId;
  @api xperienceId;
  @wire(getContactList, { accId: "$accountId" })
  contact;
  get hasContacts() {
    return this.contact && this.contact.data
      ? this.contact.data.length > 0
      : false;
  }
  handleSuccess(event) {
    this.template.querySelector("c-display-contacts").reloadContactData();
    //this.showToast();
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
  handleFinishContacts() {
    this.dispatchEvent(new CustomEvent("finishcontacts"));
  }
  handleGoBack() {
    this.dispatchEvent(new CustomEvent("backtoaccount",{
      detail: { accountId: this.accountId, xpId: this.xperienceId }
    }));
  }
}
