import { LightningElement, api, track } from "lwc";
import fetchPreviewInfo from "@salesforce/apex/XP_ExperienceController.fetchPreviewInfo";

export default class XpPreviewExperience extends LightningElement {
  @api accountId;
  @api xperienceId;
  @api journeyId;
  xpDetails;
  scheduleDateTime;
  displayDate;
  selectedDate;
  connectedCallback() {
    this.getPreviewDetails();
  }

  handleDateTimeChange(event) {
    this.scheduleDateTime = new Date(event.target.value).toLocaleString();
    this.selectedDate = new Date(event.target.value);
    this.displayDate = new Date(event.target.value).toLocaleString();
  }

  getPreviewDetails() {
    fetchPreviewInfo({ xpId: this.xperienceId }).then((result) => {
      console.log(result);
      this.xpDetails = result;
      this.scheduleDateTime = new Date().toISOString();
      this.displayDate = new Date().toLocaleString();
      this.selectedDate = new Date();
    });
  }

  handleGoBack() {
    this.dispatchEvent(new CustomEvent("backtojourney"));
  }

  getDateString(){
    return this.selectedDate.getFullYear() + ';' + this.selectedDate.getMonth() + ';' + this.selectedDate.getDate() + ';' + this.selectedDate.getHours() + ';' + this.selectedDate.getMinutes() + ';' + this.selectedDate.getSeconds();
  }

  goToFinalSchedule() {
    this.dispatchEvent(
      new CustomEvent("next", {
        detail: {
          scheduledTime:  this.getDateString(),
          displayScheduleDt: this.displayDate
        }
      })
    );
  }
}
