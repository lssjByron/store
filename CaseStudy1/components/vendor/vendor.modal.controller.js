/**
  * VendorModalController
  * - controller for vendorModal.html partial
  */
var VendorModalController = (function () {
    /**
     * constructor
     * @param modalInstance: instance of modal not the same as $modal
     * @param ven: vendor instance from in injector loaded from options
     */
    function VendorModalController(modal, vendor) {
        this.modal = modal;
        this.vendor = vendor;
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
    VendorModalController.prototype.add = function () {
        this.retVal.operation = "add";
        this.retVal.vendor = this.vendor;
        this.modal.close(this.retVal);
    }; // add
    /*
     * cancel - discard any changes then back to the main controller
     */
    VendorModalController.prototype.cancel = function () {
        this.retVal.operation = "cancel";
        if (this.vendor) {
            this.retVal.status = this.vendor.name + " not changed!";
        }
        else {
            this.retVal.status = "No Vendor Entered";
        }
        this.modal.close(this.retVal);
    }; //cancel
    /*
     * update - send modified vendor back to the main controller
     */
    VendorModalController.prototype.update = function () {
        this.retVal.operation = "update";
        this.retVal.vendor = this.vendor;
        this.modal.close(this.retVal);
    }; // update
    /*
     * delete - send vendor back to the main controller
     */
    VendorModalController.prototype.delete = function () {
        this.retVal.operation = "delete";
        this.retVal.vendor = this.vendor;
        this.modal.close(this.retVal);
    }; // delete
    //static injection
    VendorModalController.$inject = ["$modalInstance", "modalData"]; // modalData from parent controller
    //members
    VendorModalController.Id = "VendorModalController";
    return VendorModalController;
}()); // class
// add the controller to the application
app.controller("VendorModalController", VendorModalController);
//# sourceMappingURL=vendor.modal.controller.js.map