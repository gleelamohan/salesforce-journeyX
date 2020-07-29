import { LightningElement, api, track } from 'lwc';

export default class XpPreviewExperience extends LightningElement {

  @api accountId;
  @api xperienceId;
  @api journeyId;

  handleGoBack() {
    this.dispatchEvent(new CustomEvent("backtojourney"), {
      detail: { accountId: this.accountId, xpId: this.xperienceId, journeyId: this.journeyId }
    });
  }
  goToSchedule(){
    this.dispatchEvent(new CustomEvent("schedule"), {
      detail: { accountId: this.accountId, xpId: this.xperienceId, journeyId: this.journeyId }
    });
}
}