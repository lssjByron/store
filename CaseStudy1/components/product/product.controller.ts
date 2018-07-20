/**
  * Product Controller
  * - controller for product.html partial
  */
class ProductController {
    // static injection
    static $inject = ["RESTService", "$modal", "$filter"];

    //members
    products: Product[];
    status: string;
    selectedRow: number;
    product: Product;
    vendors: Vendor[];
    /**
     * constructor
     * @param restsvc: application service for processing all REST calls
     * @param modal: angular-ui modal service
     * @param filter: angular filter service for sorting cols asc/desc
     */
    constructor(public restsvc: RESTService, public modal: ng.ui.bootstrap.IModalService, public filter: ng.IFilterService) {
        this.loadProducts();
        this.loadVendors();
    } // constructor

    /*
     * loadProducts - called from constructor to call restsvc to return promise
     *                containing all product information from server
     */
    public loadProducts(msg?: string) {
        return this.restsvc.callServer("get", "product")
            .then((response: Product[]) => {
            this.products = response;
                if (msg) {
                    this.status = msg + " - Products Retrieved";
                }
                else {
                    this.status = "Products Retrieved";
                }
            })
            .catch((error: any) => this.status = "Products not retrieved code - " + error);
    } //loadProducts

    /*
     * loadVendors - called from constructor to call restsvc to return promise
     *                containing all vendor information from server
     */
    public loadVendors() {
        return this.restsvc.callServer("get", "vendor")
            .then((response: Vendor[]) => {
                this.vendors = response;
            })
            .catch((error: any) => this.status = "Vendors not retrieved code - " + error);
    } //loadVendors

    /*
     * selectRow: function to determine product selected by user
     *            then pass desired product on to the new modal
     * 
     * @param row: row to apply selected row style
     * @ param product: select product to pass to modal
     */
    public selectRow(row: number, product: Product) {
        this.selectedRow = row;
        this.product = product;
        var md = { prod: product, vens: this.vendors };
        //set up the modal's characteristics
        var options: ng.ui.bootstrap.IModalSettings = {
            templateUrl: "components/product/productModal.html",
            controller: ProductModalController.Id + " as ctrlr",
            resolve: {
                modalData: () => {
                    return md;
                }
            }
        };

        //popup the modal
        this.modal.open(options).result
            .then((results: any) => this.processModal(results))
            .catch((error: any) => this.status = error);
    } //selectRow

    /*
     * processModal - to process product information after the modal closes
     * @param results: results object containing info returned from modal
     */
    processModal(results: any) {
        var msg = "";

        switch (results.operation) {
            case "update":
                return this.restsvc.callServer("put", "product", results.product.productCode, results.product)
                    .then((response: any) => {
                        if (parseInt(response, 10) === 1) {
                            msg = "Product " + results.product.productCode + " Updated! ";
                            this.loadProducts(msg);
                        } //if
                    }) //then
                    .catch((error: any) => this.status = "Product Not Updated! - " + error);
            case "cancel":
                this.loadProducts(results.status);
                this.selectedRow = -1;
                break;
            case "delete":
                return this.restsvc.callServer("delete", "product", results.product.productCode, results.product)
                    .then((response: any) => {
                        if (parseInt(response, 10) === 1) {
                            msg = "Product " + results.product.productcode + " Deleted! ";
                            this.loadProducts(msg);
                        } //if
                    }) //then
                    .catch((error: any) => this.status = "Product Not Deleted! - " + error);
            case "add":
                return this.restsvc.callServer("post", "product", undefined, results.product)
                    .then((response: any) => {
                        msg = "Product " + response + " Added! ";
                        this.loadProducts(msg);
                    }) //then
                    .catch((error: any) => this.status = "Product Not Added! - " + error);
        }
        this.status = results;
    } // processModalChanges

    /*
     * findSelected: function to sort products array
     * @param col: which column are we sorting on
     * @param order: ascending or descending
    */
    findSelected(col: number, order: any) {
        this.products = this.filter("orderBy")(this.products, col, order);
        if (this.product) { // have we even selected an product?
            for (var i = 0; i < this.products.length; i++) { //find selected row
                if (this.products[i].productCode === this.product.productCode) {
                    this.selectedRow = i;
                }//if
            }//for
        }//if
    } //findSelected
} // class


//add the controller to the application
app.controller("ProductController", ProductController);