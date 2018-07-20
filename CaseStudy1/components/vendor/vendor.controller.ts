/**
  * Vendor Controller
  * - controller for vendor.html partial
  */
class VendorController {
    // static injection
    static $inject = ["RESTService", "$modal", "$filter"];

    //members
    vendors: Vendor[];
    status: string;
    selectedRow: number;
    vendor: Vendor;

    /**
     * constructor
     * @param restsvc: application service for processing all REST calls
     * @param modal: angular-ui modal service
     * @param filter: angular filter service for sorting cols asc/desc
     */
    constructor(public restsvc: RESTService, public modal: ng.ui.bootstrap.IModalService, public filter: ng.IFilterService) {
        this.loadVendors();
    } // constructor

    /*
     * loadVendors - called from constructor to call restsvc to return promise
     *                containing all vendor information from server
     */
    public loadVendors(msg?: string) {
        return this.restsvc.callServer("get", "vendor")
            .then((response: Vendor[]) => {
                this.vendors = response;
                if (msg) {
                    this.status = msg + " - Vendors Retrieved";
                }
                else {
                    this.status = "Vendors Retrieved";
                }
            })
            .catch((error: any) => this.status = "Vendors not retrieved code - " + error);
    } //loadVendors

    /*
     * selectRow: function to determine vendor selected by user
     *            then pass desired vendor on to the new modal
     * 
     * @param row: row to apply selected row style
     * @ param vendor: select vendor to pass to modal
     */
    public selectRow(row: number, vendor: Vendor) {
        this.selectedRow = row;
        this.vendor = vendor;
        //set up the modal's characteristics
        var options: ng.ui.bootstrap.IModalSettings = {
            templateUrl: "components/vendor/vendorModal.html",
            controller: VendorModalController.Id + " as ctrlr",
            resolve: {
                modalData: () => {
                    return vendor;
                }
            }
        };

        //popup the modal
        this.modal.open(options).result
            .then((results: any) => this.processModal(results))
            .catch((error: any) => this.status = error);
    } //selectRow

    /*
     * processModal - to process vendor information after the modal closes
     * @param results: results object containing info returned from modal
     */
    processModal(results: any) {
        var msg = "";

        switch (results.operation) {
            case "update":
                return this.restsvc.callServer("put", "vendor", results.vendor.vendorNo, results.vendor)
                    .then((response: any) => {
                        if (parseInt(response, 10) === 1) {
                            msg = "Vendor " + results.vendor.vendorNo + " Updated! ";
                            this.loadVendors(msg);
                        } //if
                    }) //then
                    .catch((error: any) => this.status = "Vendor Not Updated! - " + error);
            case "cancel":
                this.loadVendors(results.status);
                this.selectedRow = -1;
                break;
            case "delete":
                return this.restsvc.callServer("delete", "vendor", results.vendor.vendorNo, results.vendor)
                    .then((response: any) => {
                        if (parseInt(response, 10) === 1) {
                            msg = "Vendor " + results.vendor.vendorNo + " Deleted! ";
                            this.loadVendors(msg);
                        } //if
                    }) //then
                    .catch((error: any) => this.status = "Vendor Not Deleted! - " + error);
            case "add":
                return this.restsvc.callServer("post", "vendor", undefined, results.vendor)
                    .then((response: any) => {
                        msg = "Vendor " + response + " Added! ";
                        this.loadVendors(msg);
                    }) //then
                    .catch((error: any) => this.status = "Vendor Not Added! - " + error);
        }
        this.status = results;
    } // processModalChanges

    /*
     * findSelected: function to sort vendors array
     * @param col: which column are we sorting on
     * @param order: ascending or descending
    */
    findSelected(col: number, order: any) {
        this.vendors = this.filter("orderBy")(this.vendors, col, order);
        if (this.vendor) { // have we even selected an vendor?
            for (var i = 0; i < this.vendors.length; i++) { //find selected row
                if (this.vendors[i].vendorNo === this.vendor.vendorNo) {
                    this.selectedRow = i;
                }//if
            }//for
        }//if
    } //findSelected
} // class

//add the controller to the application
app.controller("VendorController", VendorController);