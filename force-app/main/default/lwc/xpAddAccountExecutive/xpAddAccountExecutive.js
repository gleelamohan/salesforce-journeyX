import { LightningElement, api, wire, track } from "lwc";
import { showToast, reduceErrors } from "c/utils";
import updateAEImage from "@salesforce/apex/XP_AccountExecutiveController.updateAEImage";
import deleteAttachment from "@salesforce/apex/XpAccountController.deleteDocument";
import linkExecAndExperience from "@salesforce/apex/XP_AccountExecutiveController.linkExecAndExperience";
import getDocumentVersionId from "@salesforce/apex/XpAccountController.fetchDocumentVersionId";
import getExecutive from "@salesforce/apex/XP_AccountExecutiveController.getExecutive";
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
  @api xperienceId = "";
  @api executiveInfo = {
    executiveId: "",
    documentId: "",
    imageUrl: "",
    iamExecutive: false
  };
  @track exec = {
    Name: "",
    Bio: "",
    Email: "",
    cno: "",
    isExecutive: false,
    documentId: "",
    imageUrl: "",
    executiveId: ""
  };
  @track backupExec = {
    Name: "",
    Bio: "",
    Email: "",
    cno: "",
    isExecutive: false,
    documentId: "",
    imageUrl: "",
    executiveId: ""
  };

  documentId = "";
  imageUrl;
  iamExecutive = false;
  executiveId = "";
  isFileRelatedToUser = true;

  connectedCallback() {
    console.log("in connectedcallback");
    this.exec.executiveId = this.executiveInfo.executiveId;
    this.exec.isExecutive = this.executiveInfo.iamExecutive;
    this.exec.imageUrl = this.executiveInfo.imageUrl;
    this.exec.documentId = this.executiveInfo.documentId;
    if (this.exec.executiveId != "") {
      this.getExecutiveDetails();
    }
  }

  renderedCallback() {
    //this.template.
    this.isFileRelatedToUser = this.exec.executiveId === "";
  }
  handleOnChange(event) {
    this.exec[event.target.name] = event.target.value;
    console.log("this.exec on change++" + JSON.stringify(this.exec));
  }
  get recid() {
    return this.exec.executiveId != "" ? this.exec.executiveId : USER_ID;
  }
  get acceptedFormats() {
    return [".png", ".jpg", ".jpeg"];
  }

  @wire(getRecord, {
    recordId: USER_ID,
    fields: ["User.Email", "User.AboutMe", "User.MobilePhone", "User.Name"]
  })
  loggedInUser;

  getExecutiveDetails() {
    getExecutive({
      executiveId: this.exec.executiveId,
      expId: this.xperienceId
    })
      .then((data) => {
        console.log(JSON.stringify(data));
        this.exec.executiveId = data.executive.Id;
        this.exec.Name = data.executive.Name;
        this.exec.Bio = data.executive.Bio__c;
        this.exec.Email = data.executive.Email__c;
        this.exec.cno = data.executive.Contact_Number__c;
        this.exec.isExecutive = data.executive.Is_Executive__c;
        if (data.cdl) {
          this.exec.documentId = data.cdl.ContentDocumentId;
          this.exec.imageUrl =
            "/sfc/servlet.shepherd/version/download/" +
            data.cdl.ContentDocument.LatestPublishedVersionId;
        }
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        this.dispatchEvent(
          showToast("Error loading Account Executive Details", "", "error")
        );
      });
  }

  /* @wire(getRecord, { recordId: "$executiveId", fields: EXEC_FIELDS })
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
  }*/

  handleExecutiveToggle(event) {
    this.exec.isExecutive = event.target.checked;
    console.log("this.exec in toggle++" + this.exec.isExecutive);
    if (event.target.checked) {
      this.backupExec = { ...this.exec };
      this.getExecutiveFromUser(event);
    } else {
      this.exec = { ...this.backupExec };
    }
  }

  getExecutiveFromUser(event) {
    console.log("in restore" + JSON.stringify(this.loggedInUser));
    this.exec.Name = this.loggedInUser.data.fields.Name.value;
    this.exec.cno = this.loggedInUser.data.fields.MobilePhone.value;
    this.exec.Email = this.loggedInUser.data.fields.Email.value;
    this.exec.Bio = this.loggedInUser.data.fields.AboutMe.value;
    this.exec.isExecutive = !event.target.checked;
    this.exec.documentId = "";
    this.exec.imageUrl = "";
    this.exec.executiveId = "";
  }

  /* findExecutive() {
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
          this.exec.Bio = result.currUser.Aboutme;
        }
      })
      .catch((error) => {
        this.error = error;
      });
  }*/

  handleUploadFinished(event) {
    console.log("detail***" + JSON.stringify(event.detail));
    const uploadedFiles = event.detail.files;
    this.exec.documentId = uploadedFiles[0].documentId;
    console.log("No. of files uploaded : " + uploadedFiles.length);
    if (this.exec.executiveId != "") {
      this.getVersionId(this.exec.executiveId);
    } else {
      this.getVersionId(USER_ID);
    }
  }
  getVersionId(rId) {
    getDocumentVersionId({
      linkedEntityId: rId,
      documentId: this.exec.documentId
    }).then((result) => {
      this.exec.imageUrl =
        "/sfc/servlet.shepherd/version/download/" +
        result.ContentDocument.LatestPublishedVersionId;
      console.log("imgurl***" + this.exec.imageUrl);
    });
  }
  handleSuccess(event) {
    this.exec.executiveId = event.detail.id;
    console.log("executiveId**" + this.exec.executiveId);
    console.log("docid***" + this.exec.documentId);
    console.log("thi***" + this.isFileRelatedToUser);
    if (!this.isFileRelatedToUser) {
      this.createJunctionRecord();
    } else {
      this.updateAttachmentId();
    }
  }
  createJunctionRecord() {
    linkExecAndExperience({
      aeId: this.exec.executiveId,
      expId: this.xperienceId
    })
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
      aeId: this.exec.executiveId,
      documentId: this.exec.documentId,
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
    deleteAttachment({ documentId: this.exec.documentId })
      .then((result) => {
        this.exec.documentId = "";
        this.exec.imageUrl = "";
      })
      .catch((error) => {
        console.log("deletedocument****" + error);
        this.error = error;
      });
  }
  addAccountExecutive(event) {
    let togglebox = this.template.querySelector(".togglecheck");
    this.exec.isExecutive = togglebox.checked;
    event.detail.fields.Is_Executive__c = this.exec.isExecutive;
    this.template
      .querySelector("lightning-record-edit-form")
      .submit(event.detail.fields);
  }
  /*addAccountExecutive(event) {
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
  }*/
  goToJourneyDetails() {
    console.log("in journey");
    /*this.dispatchEvent(
      showToast("Success", "Account Executive added successfully.")
    );*/
    console.log("before dispatch" + JSON.stringify(this.executiveInfo));

    this.dispatchEvent(
      new CustomEvent("addexecutive", {
        detail: {
          executiveId: this.exec.executiveId,
          documentId: this.exec.documentId,
          imageUrl: this.exec.imageUrl,
          iamExecutive: this.exec.isExecutive
        }
      })
    );
    console.log("after dispatch");
  }
  handleGoBack() {
    this.dispatchEvent(new CustomEvent("backtocontact"));
  }
}
