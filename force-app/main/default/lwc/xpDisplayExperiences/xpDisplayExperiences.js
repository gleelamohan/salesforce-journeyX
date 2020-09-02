import { LightningElement, wire, track } from "lwc";
import { showToast, reduceErrors } from "c/utils";
import { NavigationMixin } from "lightning/navigation";
import { deleteRecord } from "lightning/uiRecordApi";
import { refreshApex } from "@salesforce/apex";
import getMyExperiences from "@salesforce/apex/xpDisplayExperiencesCtrl.getMyExperiences";
export default class XpDisplayExperiences extends NavigationMixin(
  LightningElement
) {

  xpdata = [];
  all_xpdata = [];
  showConfirmDialog;
  selrecId;
  sortBy;
  activeFilter = 'all';
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
      sortable: "true",
      hideDefaultActions: true
    },
    {
      label: "Experience Name", fieldName: "xperienceName",
      sortable: "true", hideDefaultActions: true
    },
    {
      label: "Start Date",
      fieldName: "scheduled_date",
      type: "date",
      sortable: "true",
      hideDefaultActions: true
    },
    {
      label: "Number of Participants",
      fieldName: "participantCount",
      type: "number",
      sortable: "true", hideDefaultActions: true
    },
    {
      label: "Status", fieldName: "status", type: "text", sortable: "true", hideDefaultActions: true,
      actions: [
        { label: 'All', checked: true, name: 'all' },
        { label: 'Draft', checked: false, name: 'Draft' },
        { label: 'Scheduled', checked: false, name: 'Scheduled' }
      ]
    },
    {
      type: "action",
      typeAttributes: {
        rowActions: this.actions,
        menuAlignment: "right"
      }
    }
  ];
  @wire(getMyExperiences)
  wiredExperiences({ error, data }) {
    if (data) {
      this.xpdata = data;
      this.all_xpdata = data;
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.xpdata = undefined;
    }
  }

  doSorting(event) {
    this.sortBy = event.detail.fieldName;
    this.sortDirection = event.detail.sortDirection;
    this.sortData(this.sortBy, this.sortDirection);
  }
  sortData(fieldname, direction) {
    let parseData = JSON.parse(JSON.stringify(this.xpdata));
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
    this.xpdata = parseData;
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
  handleHeaderAction(event) {
    const actionName = event.detail.action.name;
    const colDef = event.detail.columnDefinition;
    const cols = this.columns;
    const activeFilter = this.activeFilter;

    if (actionName !== activeFilter) {
      cols.find(col => col.label === colDef.label).actions.forEach(action => action.checked = action.name === actionName);
      this.columns = [...cols];
      this.updateXpData(colDef, actionName);
    }

  }
  updateXpData(colDef, actionName) {
    const rows = this.all_xpdata;
    if (actionName !== 'all') {
      let filteredRows = [];
      filteredRows = rows.filter(_xperience => _xperience[colDef.fieldName] === actionName);
      this.xpdata = filteredRows;
    } else if (actionName === 'all') {
      this.xpdata = this.all_xpdata;
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
