import { LightningElement, wire, track } from "lwc";
import { showToast, reduceErrors } from "c/utils";
import { NavigationMixin } from "lightning/navigation";
import { deleteRecord } from "lightning/uiRecordApi";
import { refreshApex } from "@salesforce/apex";
import getMyExperiences from "@salesforce/apex/xpDisplayExperiencesCtrl.getMyExperiences";
export default class XpDisplayExperiences extends NavigationMixin(
  LightningElement
) {
  @wire(getMyExperiences)
  xpdata;
  showConfirmDialog;
  selrecId;
  sortBy;
  sortDirection;
  actions = [
    { label: "Edit", name: "edit" },
    { label: "Delete", name: "delete" }
  ];
  columns = [
    {
      label: "Account Name",
      fieldName: "accName",
      type: "text",
      sortable: "true"
    },
    { label: "Experience Name", fieldName: "xperienceName", sortable: "true" },
    {
      label: "Start Date",
      fieldName: "scheduled_date",
      type: "date",
      sortable: "true"
    },
    {
      label: "Number of Participants",
      fieldName: "participantCount",
      type: "number",
      sortable: "true"
    },
    { label: "Status", fieldName: "status", type: "text", sortable: "true" },
    {
      type: "action",
      typeAttributes: {
        rowActions: this.actions,
        menuAlignment: "right"
      }
    }
  ];

  doSorting(event) {
    this.sortBy = event.detail.fieldName;
    this.sortDirection = event.detail.sortDirection;
    this.sortData(this.sortBy, this.sortDirection);
  }
  sortData(fieldname, direction) {
    let parseData = JSON.parse(JSON.stringify(this.xpdata.data));
    // Return the value stored in the field
    let keyValue = (a) => {
      return a[fieldname];
    };
    // cheking reverse direction
    let isReverse = direction === "asc" ? 1 : -1;
    // sorting data
    parseData.sort((x, y) => {
      x = keyValue(x) ? keyValue(x) : ""; // handling null values
      y = keyValue(y) ? keyValue(y) : "";
      // sorting values based on direction
      return isReverse * ((x > y) - (y > x));
    });
    this.xpdata.data = parseData;
  }
  handleRowActions(event) {
    let actionName = event.detail.action.name;

    window.console.log("actionName ====> " + actionName);

    let row = event.detail.row;

    window.console.log("row ====> " + JSON.stringify(row));
    // eslint-disable-next-line default-case
    switch (actionName) {
      case "edit":
        this.editCurrentRecord(row);
        break;
      case "delete":
        this.deleteCurrentRow(row);
        break;
    }
  }
  editCurrentRecord(row) {
    this[NavigationMixin.Navigate]({
      type: "comm__namedPage",
      attributes: {
        name: "edit_experience__c"
      },
      state: {
        accId: row.accId,
        xpId: row.xpId
      }
    });
  }
  deleteCurrentRow(row) {
    this.selrecId = row.xpId;
    this.showConfirmDialog = true;
  }
  handleConfirmDialogNo() {
    this.showConfirmDialog = false;
    this.selrecId = "";
  }
  handleConfirmDialogYes(event) {
    this.showConfirmDialog = false;
    this.selrecId = event.target.dataset.recid;
    this.deletexp();
  }
  deletexp() {
    deleteRecord(this.selrecId)
      .then(() => {
        this.dispatchEvent(
          showToast("Experience deleted successfully.", "", "success")
        );
        return refreshApex(this.xpdata);
      })
      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error deleting record",
            message: error.body.message,
            variant: "error"
          })
        );
      });
  }
}
