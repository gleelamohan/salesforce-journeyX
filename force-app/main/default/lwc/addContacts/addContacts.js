import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
export default class AddContacts extends LightningElement {
  contactsForDisplay = [];
  @api accountId;
  columns = [
    { label: "Full Name", fieldName: "Name", type: "text", editable: true },
    { label: "Email", fieldName: "Email__c", type: "email", editable: true },
    {
      label: "Contact Number",
      fieldName: "Contact_Number__c",
      type: "phone",
      editable: true
    },
    { label: "Role", fieldName: "Role__c", type: "text", editable: true }
  ];
  handleSuccess(event) {
    let conRecord = {};
    let fields = event.detail.fields;
    conRecord.Id = event.detail.id;
    conRecord["Name"] = fields["Name"].value;
    conRecord["Role__c"] = fields.Role__c.value;
    conRecord["Email__c"] = fields.Email__c.value;
    conRecord["Contact_Number__c"] = fields.Contact_Number__c.value;
    this.contactsForDisplay = [...this.contactsForDisplay, conRecord];
    this.showToast();
    this.resetForm();
  }
  errorCallback(error, stack) {
    console.log(error, stack);
  }
  handleSubmit(event) {
    event.preventDefault(); // stop the form from submitting
    const fields = event.detail.fields;
    //fields.Account__c = this.accountId;
    fields.Account__c = "a013h000008kzPjAAI";
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
