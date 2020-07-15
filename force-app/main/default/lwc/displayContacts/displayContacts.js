import { LightningElement, api, wire } from "lwc";
import getContactList from "@salesforce/apex/XP_ContactController.fetchContacts";
import { deleteRecord } from "lightning/uiRecordApi";
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class DisplayContacts extends LightningElement {
  actions = [
    { label: "Edit", name: "edit" },
    { label: "Delete", name: "delete" }
  ];
  columns = [
    { label: "Full Name", fieldName: "Name", type: "text" },
    { label: "Email", fieldName: "Email__c", type: "email" },
    {
      label: "Contact Number",
      fieldName: "Contact_Number__c",
      type: "phone"
    },
    { label: "Role", fieldName: "Role__c", type: "text" },
    {
      type: "action",
      typeAttributes: { rowActions: this.actions }
    }
  ];
  @api accountId;
  @wire(getContactList, { accId: "$accountId" })
  contact;

  showConfirmDialog = false;
  showConEditForm = false;
  selrecId = "";

  @api reloadContactData() {
    return refreshApex(this.contact);
  }
  handleConfirmDialogNo() {
    this.showConfirmDialog = false;
    this.selrecId = "";
  }
  handleConfirmDialogYes(event) {
    this.showConfirmDialog = false;
    this.selrecId = event.target.dataset.recid;
    this.deleteContact();
  }
  deleteContact() {
    deleteRecord(this.selrecId)
      .then(() => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "Contact deleted successfully.",
            variant: "success"
          })
        );
        return refreshApex(this.contact);
      })
      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error deleting record",
            message: error.body.message,
            variant: "error"
          })
        );
      });
  }
  handleRowAction(event) {
    const actionName = event.detail.action.name;
    const row = event.detail.row;
    switch (actionName) {
      case "delete":
        this.selrecId = row.Id;
        this.showConfirmDialog = true;
        break;
      case "edit":
        this.showConEditForm = true;
        this.selrecId = row.Id;
        break;
    }
  }
  saveContact() {
    this.template.querySelector("lightning-record-edit-form").submit();
  }
  handleSuccess(event) {
    this.showToast();
    this.selrecId = "";
    this.showConEditForm = false;
    return refreshApex(this.contact);
  }
  closeEditModal() {
    this.showConEditForm = false;
    this.selrecId = "";
  }
  /*handleSave(event) {
    const fields = {};
    console.log("id***" + JSON.stringify(event.detail));
    fields[ID_FIELD.fieldApiName] = event.detail.id;
    fields[NAME_FIELD.fieldApiName] = event.detail.fields.Name.value;
    fields[EMAIL_FIELD.fieldApiName] = event.detail.fields.Email__c.value;
    fields[CONTACT_NUMBER_FIELD.fieldApiName] =
      event.detail.draftValues[0].Contact_Number__c;
    fields[ROLE_FIELD.fieldApiName] = event.detail.draftValues[0].Role__c;

    const recordInput = { fields };

    updateRecord(recordInput)
      .then(() => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "Contact updated",
            variant: "success"
          })
        );
        // Clear all draft values
        this.draftValues = [];

        // Display fresh data in the datatable
        return refreshApex(this.contact);
      })
      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error creating record",
            message: error.body.message,
            variant: "error"
          })
        );
      });
  }*/
  showToast() {
    const event = new ShowToastEvent({
      title: "Success!",
      variant: "success",
      message: "Contact Saved successfully."
    });
    this.dispatchEvent(event);
  }
}
