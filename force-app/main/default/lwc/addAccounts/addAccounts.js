import { LightningElement } from 'lwc';

export default class AddAccounts extends LightningElement {

    accountId = '';
    handleSuccess(event) {
        this.accountId = event.detail.id;
        console.log(this.accountId);
    }

    get acceptedFormats() {
        return ['.png', '.jpg', '.jpeg'];
    }

    get isUpload() {
        return this.accountId != '' ? true : false;
    }

    saveClick(event) {
        //const myfield = event.detail.fields;
        //myfield.field4 = "Hello";
        this.template.querySelector('lightning-record-edit-form').submit();
    }

    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        console.log("No. of files uploaded : " + uploadedFiles.length);
    }


}