import { LightningElement,api } from 'lwc';

export default class XpScheduleJourney extends LightningElement {
  @api accountId;
  @api xperienceId;
  @api journeyId;

  handleGoBack() {
    this.dispatchEvent(new CustomEvent("backtopreview"), {
      detail: { accountId: this.accountId, xpId: this.xperienceId, journeyId: this.journeyId }
    });
}


      
}