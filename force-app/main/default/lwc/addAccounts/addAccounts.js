import { LightningElement, api, track } from "lwc";
import updateAttachment from "@salesforce/apex/XpAccountController.updateAccountAttachment";
import deleteAttachment from "@salesforce/apex/XpAccountController.deleteDocument";
import saveXperience from "@salesforce/apex/XpAccountController.savXperience";
import getDocumentVersionId from "@salesforce/apex/XpAccountController.fetchDocumentVersionId";


export default class AddAccounts extends LightningElement {
  @api userId;
  @api accountId;
  @api xperienceId;
  @track documentId = "";
  attachmentName = "";
  attachmentRecordId;
  logo;

  connectedCallback(){
    this.attachmentRecordId = this.userId;
      if(this.accountId){
        getDocumentVersionId({ linkedEntityId: this.accountId,documentId: '' })
        .then((result) =>
        {
          if(result){
          this.attachmentRecordId = this.accountId;
          this.documentId = result.ContentDocument.Id;
          console.log( this.documentId);
          this.logo = '/Xperience/sfc/servlet.shepherd/version/download/'+result.ContentDocument.LatestPublishedVersionId;
          }
        });
      }
    
  }

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

  getVersionId(){
    getDocumentVersionId({ linkedEntityId: this.userId,documentId: this.documentId })
    .then((result) =>
    {
      this.logo = '/Xperience/sfc/servlet.shepherd/version/download/'+result.ContentDocument.LatestPublishedVersionId;
    });
  }

  dispatchAccountEvent() {
    this.insertXperience();
  }

  saveClick(event) {
    this.template.querySelector("lightning-record-edit-form").submit();
  }

  deleteAttach(event){
  
    deleteAttachment({ documentId: this.documentId })
      .then((result) => {
        this.documentId = "";
        this.attachmentName = "";
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
    this.getVersionId();
  }

  handleOnLoad(event) {
    console.log('loading finished');
    var divblock = this.template.querySelector('[data-id="divblock"]');
    if(divblock){
      this.template.querySelector('[data-id="divblock"]').className='slds-show';
    }
  }
}
