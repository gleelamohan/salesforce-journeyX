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
  @track journeyId;
  @track executiveInfo = {
    executiveId: "",
    documentId: "",
    imageUrl: "",
    iamExecutive: false
  };
  @track scheduleDt;
  @track displayDt;
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

  get isContactStage() {
    return this.stage === "contact";
  }

  get isJourneyStage() {
    return this.stage === "journey";
  }

  get isPreviewStage() {
    return this.stage === "preview";
  }

  get isScheduleJourney() {
    return this.stage === "schedule";
  }

  get isScheduled() {
    return this.stage === "scheduled";
  }

  goToAddAccounts(event) {
    this.accountId = event.detail.accountId;
    this.xpId = event.detail.xpId;
    console.log(this.accountId);
    console.log(this.xpId);
    this.stage = "account";
  }

  goToExecutive() {
    this.stage = "executive";
  }
  goToContact() {
    this.stage = "contact";
  }
  goToJourneyDetails(event) {
    this.stage = "journey";
    this.executiveInfo = event.detail;
    
  }

  goToJourneyDetailsFromPreview(event) {
    this.stage = "journey";
    
  }

  gotoPreview(event){
    this.stage = "preview";
    this.journeyId = event.detail.journeyId;
  }

  goToFinal(event){
    this.stage = "schedule";
    console.log(event.detail);
    //this.scheduleDt = event.detail;
    this.scheduleDt = event.detail.scheduledTime;
    this.displayDt = event.detail.displayScheduleDt;
  }

  goToScheduled(event){
    this.stage = "scheduled";
  }

}
