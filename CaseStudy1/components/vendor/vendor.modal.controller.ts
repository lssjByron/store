/**
  * VendorModalController
  * - controller for vendorModal.html partial
  */
class VendorModalController {
    //static injection
    static $inject = ["$modalInstance", "modalData"]; // modalData from parent controller

    //members
    static Id = "VendorModalController";
    modalTitle: string;
    retVal: any;
    todo: string;

    /**
     * constructor
     * @param modalInstance: instance of modal not the same as $modal
     * @param ven: vendor instance from in injector loaded from options
     */
    constructor(public modal: ng.ui.bootstrap.IModalServiceInstance, public vendor: Vendor) {
        this.vendor = vendor;
        if (vendor) {
            this.modalTitle = "Update Details for Vendor " + vendor.vendorNo;
            this.todo = "update";
        }
        else {
            this.modalTitle = "Add Details for New Vendor ";
            this.todo = "add";
        }

        this.retVal = { operation: "", retVendor: vendor, status: "" };
        //this.modalTitle = "Viewing Details for Vendor " + vendor.vendorno;
    }

    /*
     * add - send new vendor back to the main controller
     */
    add() {
        this.retVal.operation = "add";
        this.retVal.vendor = this.vendor;
        this.modal.close(this.retVal);
    } // add

    /*
     * cancel - discard any changes then back to the main controller
     */
    cancel() {
        this.retVal.operation = "cancel";
        if (this.vendor) {
            this.retVal.status = this.vendor.name + " not changed!";
        }
        else {
            this.retVal.status = "No Vendor Entered";
        }
        this.modal.close(this.retVal);
    } //cancel

    /*
     * update - send modified vendor back to the main controller
     */
    update() {
        this.retVal.operation = "update";
        this.retVal.vendor = this.vendor;
        this.modal.close(this.retVal);
    } // update

    /*
     * delete - send vendor back to the main controller
     */
    delete() {
        this.retVal.operation = "delete";
        this.retVal.vendor = this.vendor;
        this.modal.close(this.retVal);
    } // delete
} // class

// add the controller to the application
app.controller("VendorModalController", VendorModalController);