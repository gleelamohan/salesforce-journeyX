import { LightningElement, api } from 'lwc';
import TIME_ZONE from '@salesforce/i18n/timeZone';

export default class XpJourneyScheduled extends LightningElement {
  @api scheduledDt;
  timeZone = TIME_ZONE;
}