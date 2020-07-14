import { LightningElement, api, track } from "lwc";
import assets from "@salesforce/resourceUrl/xp_assets";

export default class Flowpath extends LightningElement {
  accountdetails = assets + "/images/account_details.png";
  addcontants = assets + "/images/add_contacts.png";
  executivedetails = assets + "/images/executive_details.png";
  journeydetails = assets + "/images/journey_details.png";
  previewjourney = assets + "/images/preview_journey.png";
  schedulejourney = assets + "/images/schedule_journey.png";

  @api stageId;
  @track stage1 = false;
  @track stage2 = false;
  @track stage3 = false;
  @track stage4 = false;
  @track stage5 = false;
  @track stage6 = false;

  connectedCallback() {
    if (this.stageId == "1") {
      this.stage1 = true;
    }
    if (this.stageId == "2") {
      this.stage2 = true;
    }
    if (this.stageId == "3") {
      this.stage3 = true;
    }
    if (this.stageId == "4") {
      this.stage4 = true;
    }
    if (this.stageId == "5") {
      this.stage5 = true;
    }
    if (this.stageId == "6") {
      this.stage6 = true;
    }
  }
}
