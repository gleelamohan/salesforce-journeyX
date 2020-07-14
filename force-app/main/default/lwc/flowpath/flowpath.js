import { LightningElement } from 'lwc';
import assets from '@salesforce/resourceUrl/xp_assets';

export default class Flowpath extends LightningElement {
  accountdetails = assets + '/images/account_details.png';
  addcontants = assets + '/images/add_contacts.png';
  executivedetails = assets + '/images/executive_details.png';
  journeydetails = assets + '/images/journey_details.png';
  previewjourney = assets + '/images/preview_journey.png';
  schedulejourney = assets + '/images/schedule_journey.png';
}