import { LightningElement, api } from "lwc";
import updateAttachment from "@salesforce/apex/XpAccountController.updateAccountAttachment";

export default class AddAccounts extends LightningElement {
  @api userId;
  accountId = "";
  documentId = "";
  handleSuccess(event) {
    this.accountId = event.detail.id;
    console.log(this.accountId);

    if (this.documentId != "") {
      this.updateAttachmentId();
    } else {
      this.dispatchAccountEvent();
    }
  }

  get acceptedFormats() {
    return [".png", ".jpg", ".jpeg"];
  }

  get isUpload() {
    return this.accountId != "" ? true : false;
  }

  updateAttachmentId() {
    updateAttachment({ accountId: this.accountId, documentId: this.documentId })
      .then((result) => {
        this.contacts = result;
        this.dispatchAccountEvent();
      })
      .catch((error) => {
        this.error = error;
      });
  }

  dispatchAccountEvent() {
    const accEvent = new CustomEvent("accountsubmit", {
      detail: { accountId: this.accountId }
    });
    this.dispatchEvent(accEvent);
  }

  saveClick(event) {
    this.template.querySelector("lightning-record-edit-form").submit();
  }

  handleUploadFinished(event) {
    const uploadedFiles = event.detail.files;
    this.documentId = uploadedFiles[0].documentId;
    console.log("No. of files uploaded : " + uploadedFiles.length);
  }
}
