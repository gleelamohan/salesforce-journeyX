import { LightningElement, api, track } from "lwc";
import fetchJourneys from "@salesforce/apex/XP_JourneyController.fetchJourneys";
import fetchJourney from "@salesforce/apex/XP_JourneyController.fetchJourney";
import addJourney from "@salesforce/apex/XP_JourneyController.addJourney";

export default class XpJourneyDetails extends LightningElement {
  @api accountId;
  @api xperienceId;
  @api journeyId;
  @api executiveId;
  @track journeyInfo;
  journeyValue = "Select Experience Name";
  description;
  key;
  journeyImage;

  @track dropdown = [];

  connectedCallback() {
    console.log('Journey Id' + this.journeyId);
    
    this.getJourneys();
    
  }

  handleGoBack() {
    console.log("in goback");
    this.dispatchEvent(new CustomEvent("backtoexecutive"));
  }
  getJourney(){
    fetchJourney({ journeyId: this.journeyId}).then((result) => {
      console.log(result);
      this.description = result[0].journey.Description__c;
      this.journeyValue = result[0].journey.Name;
      this.key = result[0].journey.Journey_Id__c;
      this.journeyId = result[0].journey.Id;
      this.journeyImage = '/sfc/servlet.shepherd/version/download/'+result[0].cdLink.ContentDocument.LatestPublishedVersionId;
  
    });
  }

  getJourneys() {
    fetchJourneys().then((result) => {
      console.log(result);
      this.journeyInfo = result;

      this.dropdown = this.journeyInfo.reduce((acc, item) => {
        acc.push({ label: item.journey.Name, value: item.journey.Name });
        return acc;
      }, []);
      this.dropdown.splice(0, 0, {
        label: "Select Experience Name",
        value: "Select Experience Name"
      });
      
      if(typeof(this.journeyId) !== 'undefined'){
        this.getJourney();
      }
    });
  }

  addExperienceJourney(event){
    addJourney({ journeyId: this.journeyId, xp_id: this.xperienceId }).then((result) => {

      console.log("Journey Added!!");
      const journeyEvent = new CustomEvent("journeysubmit", {
        detail: { accountId: this.accountId, xpId: this.xperienceId, journeyId: this.journeyId }
      });
      this.dispatchEvent(journeyEvent);

    });

  }

  handleChange(event) {
    this.journeyValue = event.detail.value;

    let selectedJourney = this.journeyInfo.filter((item) => {
      return (item.journey.Name = this.journeyValue);
    });
    this.description = selectedJourney[0].journey.Description__c;
    this.key = selectedJourney[0].journey.Journey_Id__c;
    this.journeyId = selectedJourney[0].journey.Id;
    this.journeyImage = '/sfc/servlet.shepherd/version/download/'+selectedJourney[0].cdLink.ContentDocument.LatestPublishedVersionId;
  }
}
