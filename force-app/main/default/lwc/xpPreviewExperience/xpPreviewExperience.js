import { LightningElement, api, track } from "lwc";
import fetchPreviewInfo from "@salesforce/apex/XP_ExperienceController.fetchPreviewInfo";

export default class XpPreviewExperience extends LightningElement {
  @api accountId;
  @api xperienceId;
  @api journeyId;
  xpDetails;
  scheduleDateTime;
  connectedCallback() {
    this.getPreviewDetails();
  }

  handleDateTimeChange(event) {
    this.scheduleDateTime = new Date(event.target.value).toLocaleString();
  }

  getPreviewDetails() {
    fetchPreviewInfo({ xpId: this.xperienceId }).then((result) => {
      console.log(result);
      this.xpDetails = result;
      this.scheduleDateTime = new Date().toISOString();
    });
  }

  handleGoBack() {
    this.dispatchEvent(new CustomEvent("backtojourney"));
  }

  goToFinalSchedule() {
    this.dispatchEvent(new CustomEvent("next"), {bubbles: true , composed : true ,
      detail: this.scheduleDateTime
    },);
  }
}
