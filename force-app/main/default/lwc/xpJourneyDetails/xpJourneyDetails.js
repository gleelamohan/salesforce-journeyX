import { LightningElement, api, track } from "lwc";
import fetchJourneys from "@salesforce/apex/XP_JourneyController.fetchJourneys";

export default class XpJourneyDetails extends LightningElement {
  @api accountId;
  @api xperienceId;
  @api executiveId;
  @track journeyInfo;
  journeyValue = "Select Experience Name";
  description;
  key;
  journeyImage;
  @track dropdown = [];

  connectedCallback() {
    this.getJourneys();
  }

  handleGoBack() {
    console.log("in goback");
    this.dispatchEvent(new CustomEvent("backtoexecutive"));
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
    });
  }

  handleChange(event) {
    this.journeyValue = event.detail.value;

    let selectedJourney = this.journeyInfo.filter((item) => {
      return (item.journey.Name = this.journeyValue);
    });

    this.description = selectedJourney[0].journey.Description__c;
    this.key = selectedJourney[0].journey.Journey_Id__c;
    this.journeyImage = '/sfc/servlet.shepherd/version/download/'+selectedJourney[0].cdLink.ContentDocument.LatestPublishedVersionId;
  }
}
