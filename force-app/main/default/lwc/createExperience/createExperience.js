import { LightningElement, wire, track, api } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import USER_ID from "@salesforce/user/Id";
import NAME_FIELD from "@salesforce/schema/User.Name";

export default class CreateExperience extends LightningElement {
  @track error;
  @track name;
  @track id;
  @api stage = "account";
  @track accountId;
  @track xpId;

  @wire(getRecord, {
    recordId: USER_ID,
    fields: [NAME_FIELD]
  })
  wireuser({ error, data }) {
    if (error) {
      this.error = error;
    } else if (data) {
      console.log(data);
      this.name = data.fields.Name.value;
      this.id = data.id;
    }
  }

  contactStage(event) {
    this.accountId = event.detail.accountId;
    this.xpId = event.detail.xpId;
    this.stage = "contact";
  }

  get isAccountStage() {
    return this.stage === "account";
  }

  get isAEStage() {
    return this.stage === "executive";
  }

  get isContactStage(){
    return this.stage === "contact";
  }

  goToAddAccounts(event) {
    this.accountId = event.detail.accountId;
    this.xpId = event.detail.xpId;
    console.log(this.accountId );
    console.log(this.xpId);
    this.stage = "account";
  }

  goToExecutive() {
    this.stage = "executive";
  }
  goToContact() {
    this.stage = "contact";
  }
}
