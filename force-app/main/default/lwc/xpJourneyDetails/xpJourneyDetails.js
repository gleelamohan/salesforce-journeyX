import { LightningElement, api } from "lwc";

export default class XpJourneyDetails extends LightningElement {
  @api accountId;
  @api xperienceId;
  @api executiveId;
  handleGoBack() {
    console.log("in goback");
    this.dispatchEvent(new CustomEvent("backtoexecutive"));
  }
}
