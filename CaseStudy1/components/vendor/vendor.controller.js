/**
  * Vendor Controller
  * - controller for vendor.html partial
  */
var VendorController = (function () {
    /**
     * constructor
     * @param restsvc: application service for processing all REST calls
     * @param modal: angular-ui modal service
     * @param filter: angular filter service for sorting cols asc/desc
     */
    function VendorController(restsvc, modal, filter) {
        this.restsvc = restsvc;
        this.modal = modal;
        this.filter = filter;
        this.loadVendors();
    } // constructor
    /*
     * loadVendors - called from constructor to call restsvc to return promise
     *                containing all vendor information from server
     */
    VendorController.prototype.loadVendors = function (msg) {
        var _this = this;
        return this.restsvc.callServer("get", "vendor")
            .then(function (response) {
            _this.vendors = response;
            if (msg) {
                _this.status = msg + " - Vendors Retrieved";
            }
            else {
                _this.status = "Vendors Retrieved";
            }
        })
            .catch(function (error) { return _this.status = "Vendors not retrieved code - " + error; });
    }; //loadVendors
    /*
     * selectRow: function to determine vendor selected by user
     *            then pass desired vendor on to the new modal
     *
     * @param row: row to apply selected row style
     * @ param vendor: select vendor to pass to modal
     */
    VendorController.prototype.selectRow = function (row, vendor) {
        var _this = this;
        this.selectedRow = row;
        this.vendor = vendor;
        //set up the modal's characteristics
        var options = {
            templateUrl: "components/vendor/vendorModal.html",
            controller: VendorModalController.Id + " as ctrlr",
            resolve: {
                modalData: function () {
                    return vendor;
                }
            }
        };
        //popup the modal
        this.modal.open(options).result
            .then(function (results) { return _this.processModal(results); })
            .catch(function (error) { return _this.status = error; });
    }; //selectRow
    /*
     * processModal - to process vendor information after the modal closes
     * @param results: results object containing info returned from modal
     */
    VendorController.prototype.processModal = function (results) {
        var _this = this;
        var msg = "";
        switch (results.operation) {
            case "update":
                return this.restsvc.callServer("put", "vendor", results.vendor.vendorNo, results.vendor)
                    .then(function (response) {
                    if (parseInt(response, 10) === 1) {
                        msg = "Vendor " + results.vendor.vendorNo + " Updated! ";
                        _this.loadVendors(msg);
                    } //if
                }) //then
                    .catch(function (error) { return _this.status = "Vendor Not Updated! - " + error; });
            case "cancel":
                this.loadVendors(results.status);
                this.selectedRow = -1;
                break;
            case "delete":
                return this.restsvc.callServer("delete", "vendor", results.vendor.vendorNo, results.vendor)
                    .then(function (response) {
                    if (parseInt(response, 10) === 1) {
                        msg = "Vendor " + results.vendor.vendorNo + " Deleted! ";
                        _this.loadVendors(msg);
                    } //if
                }) //then
                    .catch(function (error) { return _this.status = "Vendor Not Deleted! - " + error; });
            case "add":
                return this.restsvc.callServer("post", "vendor", undefined, results.vendor)
                    .then(function (response) {
                    msg = "Vendor " + response + " Added! ";
                    _this.loadVendors(msg);
                }) //then
                    .catch(function (error) { return _this.status = "Vendor Not Added! - " + error; });
        }
        this.status = results;
    }; // processModalChanges
    /*
     * findSelected: function to sort vendors array
     * @param col: which column are we sorting on
     * @param order: ascending or descending
    */
    VendorController.prototype.findSelected = function (col, order) {
        this.vendors = this.filter("orderBy")(this.vendors, col, order);
        if (this.vendor) {
            for (var i = 0; i < this.vendors.length; i++) {
                if (this.vendors[i].vendorNo === this.vendor.vendorNo) {
                    this.selectedRow = i;
                } //if
            } //for
        } //if
    }; //findSelected
    // static injection
    VendorController.$inject = ["RESTService", "$modal", "$filter"];
    return VendorController;
}()); // class
//add the controller to the application
app.controller("VendorController", VendorController);
//# sourceMappingURL=vendor.controller.js.map