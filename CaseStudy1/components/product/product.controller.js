/**
  * Product Controller
  * - controller for product.html partial
  */
var ProductController = (function () {
    /**
     * constructor
     * @param restsvc: application service for processing all REST calls
     * @param modal: angular-ui modal service
     * @param filter: angular filter service for sorting cols asc/desc
     */
    function ProductController(restsvc, modal, filter) {
        this.restsvc = restsvc;
        this.modal = modal;
        this.filter = filter;
        this.loadProducts();
        this.loadVendors();
    } // constructor
    /*
     * loadProducts - called from constructor to call restsvc to return promise
     *                containing all product information from server
     */
    ProductController.prototype.loadProducts = function (msg) {
        var _this = this;
        return this.restsvc.callServer("get", "product")
            .then(function (response) {
            _this.products = response;
            if (msg) {
                _this.status = msg + " - Products Retrieved";
            }
            else {
                _this.status = "Products Retrieved";
            }
        })
            .catch(function (error) { return _this.status = "Products not retrieved code - " + error; });
    }; //loadProducts
    /*
     * loadVendors - called from constructor to call restsvc to return promise
     *                containing all vendor information from server
     */
    ProductController.prototype.loadVendors = function () {
        var _this = this;
        return this.restsvc.callServer("get", "vendor")
            .then(function (response) {
            _this.vendors = response;
        })
            .catch(function (error) { return _this.status = "Vendors not retrieved code - " + error; });
    }; //loadVendors
    /*
     * selectRow: function to determine product selected by user
     *            then pass desired product on to the new modal
     *
     * @param row: row to apply selected row style
     * @ param product: select product to pass to modal
     */
    ProductController.prototype.selectRow = function (row, product) {
        var _this = this;
        this.selectedRow = row;
        this.product = product;
        var md = { prod: product, vens: this.vendors };
        //set up the modal's characteristics
        var options = {
            templateUrl: "components/product/productModal.html",
            controller: ProductModalController.Id + " as ctrlr",
            resolve: {
                modalData: function () {
                    return md;
                }
            }
        };
        //popup the modal
        this.modal.open(options).result
            .then(function (results) { return _this.processModal(results); })
            .catch(function (error) { return _this.status = error; });
    }; //selectRow
    /*
     * processModal - to process product information after the modal closes
     * @param results: results object containing info returned from modal
     */
    ProductController.prototype.processModal = function (results) {
        var _this = this;
        var msg = "";
        switch (results.operation) {
            case "update":
                return this.restsvc.callServer("put", "product", results.product.productCode, results.product)
                    .then(function (response) {
                    if (parseInt(response, 10) === 1) {
                        msg = "Product " + results.product.productCode + " Updated! ";
                        _this.loadProducts(msg);
                    } //if
                }) //then
                    .catch(function (error) { return _this.status = "Product Not Updated! - " + error; });
            case "cancel":
                this.loadProducts(results.status);
                this.selectedRow = -1;
                break;
            case "delete":
                return this.restsvc.callServer("delete", "product", results.product.productCode, results.product)
                    .then(function (response) {
                    if (parseInt(response, 10) === 1) {
                        msg = "Product " + results.product.productcode + " Deleted! ";
                        _this.loadProducts(msg);
                    } //if
                }) //then
                    .catch(function (error) { return _this.status = "Product Not Deleted! - " + error; });
            case "add":
                return this.restsvc.callServer("post", "product", undefined, results.product)
                    .then(function (response) {
                    msg = "Product " + response + " Added! ";
                    _this.loadProducts(msg);
                }) //then
                    .catch(function (error) { return _this.status = "Product Not Added! - " + error; });
        }
        this.status = results;
    }; // processModalChanges
    /*
     * findSelected: function to sort products array
     * @param col: which column are we sorting on
     * @param order: ascending or descending
    */
    ProductController.prototype.findSelected = function (col, order) {
        this.products = this.filter("orderBy")(this.products, col, order);
        if (this.product) {
            for (var i = 0; i < this.products.length; i++) {
                if (this.products[i].productCode === this.product.productCode) {
                    this.selectedRow = i;
                } //if
            } //for
        } //if
    }; //findSelected
    // static injection
    ProductController.$inject = ["RESTService", "$modal", "$filter"];
    return ProductController;
}()); // class
//add the controller to the application
app.controller("ProductController", ProductController);
//# sourceMappingURL=product.controller.js.map