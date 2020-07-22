import { LightningElement,api } from 'lwc';

export default class EditAccounts extends LightningElement {
  @api xperienceId;
  @api accountId;
  @api userId;

  connectedCallback(){
    console.log(this.accountId);
    console.log(this.xperienceId);
    console.log(this.userId);
  }
}