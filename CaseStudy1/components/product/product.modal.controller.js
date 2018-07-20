/**
  * ProductModalController
  * - controller for productModal.html partial
  */
var ProductModalController = (function () {
    /**
     * constructor
     * @param modalInstance: instance of modal not the same as $modal
     * @param ven: product instance from in injector loaded from options
     */
    function ProductModalController(modal, modalData) {
        this.modal = modal;
        this.product = modalData.prod;
        this.vendors = modalData.vens;
        if (this.product) {
            //this.venNo = this.product.vendorNo;
            this.modalTitle = "Update Details for Product " + this.product.productCode;
            this.todo = "update";
        }
        else {
            this.modalTitle = "Add Details for New Product ";
            this.todo = "add";
        }
        this.retVal = { operation: "", retProduct: this.product, status: "" };
        //this.modalTitle = "Viewing Details for Product " + product.productcode;
    }
    /*
     * add - send new product back to the main controller
     */
    ProductModalController.prototype.add = function () {
        this.retVal.operation = "add";
        this.retVal.product = this.product;
        this.modal.close(this.retVal);
    }; // add
    /*
     * cancel - discard any changes then back to the main controller
     */
    ProductModalController.prototype.cancel = function () {
        this.retVal.operation = "cancel";
        if (this.product) {
            this.retVal.status = this.product.productName + " not changed!";
        }
        else {
            this.retVal.status = "No Product Entered";
        }
        this.modal.close(this.retVal);
    }; //cancel
    /*
     * update - send modified product back to the main controller
     */
    ProductModalController.prototype.update = function () {
        this.retVal.operation = "update";
        this.retVal.product = this.product;
        this.modal.close(this.retVal);
    }; // update
    /*
     * delete - send product back to the main controller
     */
    ProductModalController.prototype.delete = function () {
        this.retVal.operation = "delete";
        this.retVal.product = this.product;
        this.modal.close(this.retVal);
    }; // delete
    //static injection
    ProductModalController.$inject = ["$modalInstance", "modalData"]; // modalData from parent controller
    //members
    ProductModalController.Id = "ProductModalController";
    return ProductModalController;
}()); // class
// add the controller to the application
app.controller("ProductModalController", ProductModalController);
//# sourceMappingURL=product.modal.controller.js.map