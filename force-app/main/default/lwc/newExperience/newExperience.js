import { LightningElement } from 'lwc';
import assets from '@salesforce/resourceUrl/xp_assets';

export default class NewExperience extends LightningElement {
    logo = assets + '/images/newexp.png';

    navigateToCreateExp() {
        window.location.href = "/s/create-experience";
    }
}