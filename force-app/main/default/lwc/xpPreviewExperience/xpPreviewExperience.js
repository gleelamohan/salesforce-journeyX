import { LightningElement, api, track } from "lwc";
import fetchPreviewInfo from "@salesforce/apex/XP_ExperienceController.fetchPreviewInfo";
import TIME_ZONE from '@salesforce/i18n/timeZone';

export default class XpPreviewExperience extends LightningElement {
  @api accountId;
  @api xperienceId;
  @api journeyId;
  xpDetails;
  scheduleDateTime;
  displayDate;
  selectedDate;
  timeZone = TIME_ZONE;
  connectedCallback() {
    this.getPreviewDetails();
  }

  handleDateTimeChange(event) {
    //this.scheduleDateTime = new Date(event.target.value).toUTCString();
    this.selectedDate = event.target.value;
    this.scheduleDateTime = event.target.value;
    //this.displayDate = new Date(event.target.value).toUTCString();
  }

  getPreviewDetails() {
    fetchPreviewInfo({ xpId: this.xperienceId }).then((result) => {
      console.log('result:'+JSON.stringify(result));
      this.xpDetails = result;
      this.scheduleDateTime = new Date().toUTCString();
      this.displayDate = new Date().toUTCString();
      if(result.hasOwnProperty('startDateTime') && result.startDateTime!=null && result.startDateTime!='' && result.startDateTime!=undefined){
        this.selectedDate = result.startDateTime;
        this.scheduleDateTime = result.startDateTime;
      } else {
        this.selectedDate = new Date();
        this.scheduleDateTime = new Date().toUTCString();
      }
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
          scheduledTime:  this.selectedDate,
          displayScheduleDt: this.selectedDate
        }
      })
    );
  }
}
