import { LightningElement, api } from 'lwc';
import updateAttachment from '@salesforce/apex/XpAccountController.updateAccountAttachment';

export default class AddAccounts extends LightningElement {

    @api userId;
    accountId = '';
    documentId = '';
    handleSuccess(event) {
        this.accountId = event.detail.id;
        console.log(this.accountId);

        this.updateAttachmentId();


    }

    get acceptedFormats() {
        return ['.png', '.jpg', '.jpeg'];
    }

    get isUpload() {
        return this.accountId != '' ? true : false;
    }

    updateAttachmentId() {
        updateAttachment({ accountId: this.accountId, documentId: this.documentId })
            .then(result => {
                this.contacts = result;
            })
            .catch(error => {
                this.error = error;
            });
    }

    saveClick(event) {
        //const myfield = event.detail.fields;
        //myfield.field4 = "Hello";
        this.template.querySelector('lightning-record-edit-form').submit();
    }

    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        this.documentId = uploadedFiles[0].documentId;
        console.log("No. of files uploaded : " + uploadedFiles.length);
    }


}