import { LightningElement, api } from "lwc";
import updateAttachment from "@salesforce/apex/XpAccountController.updateAccountAttachment";
import deleteAttachment from "@salesforce/apex/XpAccountController.deleteDocument";
import saveXperience from "@salesforce/apex/XpAccountController.savXperience";

export default class AddAccounts extends LightningElement {
  @api userId;
  @api accountId;
  @api xperienceId;
  documentId = "";
  attachmentName = "";
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

  updateAttachmentId() {
    updateAttachment({ accountId: this.accountId, documentId: this.documentId })
      .then((result) => {
        //this.contacts = result;
        this.dispatchAccountEvent();
      })
      .catch((error) => {
        this.error = error;
      });
  }
  insertXperience()
  {
    saveXperience({ accountId: this.accountId})
      .then((result) => {
        console.log(result);
        this.xperienceId = result;
        const accEvent = new CustomEvent("accountsubmit", {
          detail: { accountId: this.accountId, xpId: this.xperienceId }
        });
        this.dispatchEvent(accEvent);
      })
      .catch((error) => {
        this.error = error;
      });
  }

  dispatchAccountEvent() {
    this.insertXperience();
  }

  saveClick(event) {
    this.template.querySelector("lightning-record-edit-form").submit();
  }

  deleteAttachment(event){
      this.documentId = "";
      this.attachmentName = "";

      updateAttachment({ documentId: this.documentId })
      .then((result) => {
         console.log('document deleted');
      })
      .catch((error) => {
        this.error = error;
        console.log(error);
      });
  }

  handleUploadFinished(event) {
    const uploadedFiles = event.detail.files;
    this.documentId = uploadedFiles[0].documentId;
    this.attachmentName = uploadedFiles[0].name;
    console.log("No. of files uploaded : " + uploadedFiles.length);
  }
}
