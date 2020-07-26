import { LightningElement, api, wire, track } from "lwc";
import { showToast, reduceErrors } from "c/utils";
import updateAEImage from "@salesforce/apex/XP_AccountExecutiveController.updateAEImage";
import deleteAttachment from "@salesforce/apex/XpAccountController.deleteDocument";
import linkExecAndExperience from "@salesforce/apex/XP_AccountExecutiveController.linkExecAndExperience";
import getDocumentVersionId from "@salesforce/apex/XpAccountController.fetchDocumentVersionId";
import fetchExecutive from "@salesforce/apex/XP_AccountExecutiveController.fetchExecutive";
import { getRecord } from "lightning/uiRecordApi";
import USER_ID from "@salesforce/user/Id";

const EXEC_FIELDS = [
  "XP_Executive__c.Name",
  "XP_Executive__c.Bio__c",
  "XP_Executive__c.Contact_Number__c",
  "XP_Executive__c.Email__c"
];

export default class XpAddAccountExecutive extends LightningElement {
  @api accountId = "";
  iamExecutive = false;
  @api xperienceId = "";
  documentId = "";
  imageUrl;
  executiveId = "";
  @api executiveInfo = {
    executiveId: "",
    documentId: "",
    imageUrl: "",
    iamExecutive: false
  };
  isFileRelatedToUser = true;
  @track exec = { Name: "", Bio: "", Email: "", cno: "" };
  connectedCallback() {
    console.log("in connectedcallback");
    this.executiveId = this.executiveInfo.executiveId;
    this.iamExecutive = this.executiveInfo.iamExecutive;
    this.imageUrl = this.executiveInfo.imageUrl;
    this.documentId = this.executiveInfo.documentId;
  }
  renderedCallback() {
    this.isFileRelatedToUser = this.executiveId === "";
  }

  get recid() {
    return this.executiveId != "" ? this.executiveId : USER_ID;
  }
  get acceptedFormats() {
    return [".png", ".jpg", ".jpeg"];
  }
  @wire(getRecord, { recordId: USER_ID, fields: ["User.Email"] })
  loggedInUser;
  @wire(getRecord, { recordId: "$executiveId", fields: EXEC_FIELDS })
  getExecRecord({ error, data }) {
    if (error) {
      this.dispatchEvent(
        showToast("Error loading Account Executive Details", "", "error")
      );
    } else if (data) {
      console.log(JSON.stringify(data));
      this.exec.Name = data.fields.Name.value;
      this.exec.Bio = data.fields.Bio__c.value;
      this.exec.Email = data.fields.Email__c.value;
      this.exec.cno = data.fields.Contact_Number__c.value;
    }
  }

  handleExecutiveToggle(event) {
    this.iamExecutive = event.target.checked;
    if (this.iamExecutive) {
      this.findExecutive();
    } else {
      this.exec = { Name: "", Bio: "", Email: "", cno: "" };
      this.documentId = "";
      this.imageUrl = "";
      this.executiveId = "";
    }
  }
  findExecutive() {
    fetchExecutive()
      .then((result) => {
        console.log(JSON.stringify(result));
        if (!result.isUser) {
          this.exec.Name = result.executive.Name;
          this.executiveId = result.executive.Id;
          this.exec.Email = result.executive.Email__c;
          this.exec.Bio = result.executive.Bio__c;
          this.exec.cno = result.executive.Contact_Number__c;
          if (result.cdl) {
            this.documentId = result.cdl.ContentDocumentId;
            this.imageUrl =
              "/sfc/servlet.shepherd/version/download/" +
              result.cdl.ContentDocument.LatestPublishedVersionId;
            console.log("in if" + this.imageUrl);
          }
        } else {
          this.exec.Name = result.currUser.Name;
          this.exec.cno = result.currUser.Phone;
          this.exec.Email = result.currUser.Email;
        }
      })
      .catch((error) => {
        this.error = error;
      });
  }
  handleUploadFinished(event) {
    console.log("detail***" + JSON.stringify(event.detail));
    const uploadedFiles = event.detail.files;
    this.documentId = uploadedFiles[0].documentId;
    console.log("No. of files uploaded : " + uploadedFiles.length);
    if (this.executiveId != "") {
      this.getVersionId(this.executiveId);
    } else {
      this.getVersionId(USER_ID);
    }
  }
  getVersionId(rId) {
    getDocumentVersionId({
      linkedEntityId: rId,
      documentId: this.documentId
    }).then((result) => {
      this.imageUrl =
        "/sfc/servlet.shepherd/version/download/" +
        result.ContentDocument.LatestPublishedVersionId;
      console.log("imgurl***" + this.imageUrl);
    });
  }
  handleSuccess(event) {
    this.executiveId = event.detail.id;
    console.log("executiveId**" + this.executiveId);
    console.log("docid***" + this.documentId);
    console.log("thi***" + this.isFileRelatedToUser);
    if (!this.isFileRelatedToUser) {
      this.createJunctionRecord();
    } else {
      this.updateAttachmentId();
    }
  }
  createJunctionRecord() {
    linkExecAndExperience({ aeId: this.executiveId, expId: this.xperienceId })
      .then((result) => {
        this.goToJourneyDetails();
      })
      .catch((error) => {
        console.log("error**" + JSON.stringify(error));
        this.dispatchEvent(showToast("Error in Adding Executive", "", "error"));
      });
  }
  updateAttachmentId() {
    updateAEImage({
      aeId: this.executiveId,
      documentId: this.documentId,
      expId: this.xperienceId
    })
      .then((result) => {
        console.log("junction recId****" + result);
        this.goToJourneyDetails();
      })
      .catch((error) => {
        console.log("message***" + JSON.stringify(error));
        this.dispatchEvent(showToast("Error in adding Executive", "", "error"));
      });
  }
  deleteImage(event) {
    deleteAttachment({ documentId: this.documentId })
      .then((result) => {
        this.documentId = "";
        this.imageUrl = "";
      })
      .catch((error) => {
        console.log("deletedocument****" + error);
        this.error = error;
      });
  }
  addAccountExecutive(event) {
    console.log("fields****" + JSON.stringify(event.detail.fields));
    event.preventDefault();
    console.log("in submit**" + JSON.stringify(this.loggedInUser));

    let currUserEmail = this.loggedInUser.data.fields.Email.value;
    console.log("currUserEmail***" + currUserEmail);
    console.log("this.exec.email***" + this.exec.Email);
    console.log("iamExecutive***" + this.iamExecutive);
    console.log("executiveId***" + this.executiveId);
    console.log("recordId***" + event.detail.id);
    if (!this.iamExecutive && event.detail.fields.Email__c === currUserEmail) {
      this.dispatchEvent(
        showToast(
          "Looks like you're the Account Executive!",
          "If you're the Account Executive, then flick the switch, 'I am an Executive'",
          "warning"
        )
      );
      return false;
    } else {
      this.template
        .querySelector("lightning-record-edit-form")
        .submit(event.detail.fields);
    }
  }
  goToJourneyDetails() {
    console.log("in journey");
    this.dispatchEvent(
      showToast("Success", "Account Executive added successfully.")
    );
    console.log("before dispatch" + JSON.stringify(this.executiveInfo));

    this.dispatchEvent(
      new CustomEvent("addexecutive", {
        detail: {
          executiveId: this.executiveId,
          documentId: this.documentId,
          imageUrl: this.imageUrl,
          iamExecutive: this.iamExecutive
        }
      })
    );
    console.log("after dispatch");
  }
  handleGoBack() {
    this.dispatchEvent(new CustomEvent("backtocontact"));
  }
}
