import { LightningElement,api, track } from 'lwc';
import scheduleJourney from "@salesforce/apex/XP_ExperienceController.scheduleJourney";


export default class XpScheduleJourney extends LightningElement {
 
  @api xperienceId;
  @api scheduleId;
  @api displayDt;
  @track  disabled = true;
  @track checked = false;


  changeToggle(event){
    this.checked = !this.checked;
    console.log(this.scheduleId);
    if(this.checked ){
       this.disabled = false;
    }
    else{
      this.disabled = true;
    }
}

  handleGoBack() {
    this.dispatchEvent(new CustomEvent("backtopreview"));
}

submitExperience() {
  console.log(this.scheduleId);
  console.log(this.xperienceId);
  scheduleJourney({
    scheduleDate: this.displayDt,
    xpId: this.xperienceId
  }).then((result) => {
    console.log("Journey Scheduled Successfully!!");
    this.goToScheduled();
  });
}

goToScheduled() {
  this.dispatchEvent(
    new CustomEvent("scheduled")
  );
}
      
}