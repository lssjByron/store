/**
  * Product Controller
  * - controller for product.html partial
  */
var GeneratorController = (function () {
    /**
     * constructor
     * @param restsvc: application service for processing all REST calls
     * @param modal: angular-ui modal service
     * @param filter: angular filter service for sorting cols asc/desc
     */
    function GeneratorController(restsvc, windowsvc) {
        this.restsvc = restsvc;
        this.windowsvc = windowsvc;
        this.loadProducts();
        this.loadVendors();
        this.pickedVendor = false;
        this.isAddClick = false;
        this.status = "Choose a Vendor";
        this.isPOClick = false;
    } // constructor
    /*
     * loadProducts - called from constructor to call restsvc to return promise
     *                containing all product information from server
     */
    GeneratorController.prototype.loadProducts = function (msg) {
        var _this = this;
        return this.restsvc.callServer("get", "product")
            .then(function (response) {
            _this.products = response;
        })
            .catch(function (error) { return _this.status = "Products not retrieved code - " + error; });
    }; //loadProducts
    /*
     * loadVendors - called from constructor to call restsvc to return promise
     *                containing all vendor information from server
     */
    GeneratorController.prototype.loadVendors = function () {
        var _this = this;
        return this.restsvc.callServer("get", "vendor")
            .then(function (response) {
            _this.vendors = response;
        })
            .catch(function (error) { return _this.status = "Vendors not retrieved code - " + error; });
    }; //loadVendors
    GeneratorController.prototype.setPrices = function (baseprice, isMinus) {
        if (isMinus == true)
            this.sub = (parseFloat(this.sub) - baseprice).toFixed(2);
        else
            this.sub = (parseFloat(this.sub) + baseprice).toFixed(2);
        if (baseprice == 0) {
            this.sub = "0";
            this.isAddClick = false;
        }
        this.tax = (Math.round((parseFloat(this.sub) * 0.13) * 100) / 100).toFixed(2);
        this.total = (Math.round((parseFloat(this.sub) + parseFloat(this.tax)) * 100) / 100).toFixed(2);
    };
    GeneratorController.prototype.addItem = function () {
        this.isPOClick = false;
        var quantity;
        if (this.quantity == "EOQ") {
            quantity = this.product.EOQ;
        }
        else {
            quantity = parseInt(this.quantity);
        }
        if (quantity != 0) {
            this.isAddClick = true;
            this.setPrices((this.product.costPrice * quantity), false);
            var isDupProd = false;
            for (var i = 0; i < this.genItems.length; i++) {
                if (this.product.productName == this.genItems[i].productname) {
                    this.genItems[i].qty += quantity;
                    this.genItems[i].ext += this.product.costPrice * quantity;
                    isDupProd = true;
                    break;
                }
            }
            if (isDupProd == false) {
                this.genItems.push({
                    prodcd: this.product.productCode,
                    productname: this.product.productName,
                    ext: (this.product.costPrice * quantity),
                    price: this.product.costPrice,
                    qty: quantity
                });
            }
            this.status = "item Added";
        }
        else {
            for (var i = 0; i < this.genItems.length; i++) {
                if (this.product.productName == this.genItems[i].productname) {
                    this.setPrices(this.genItems[i].ext, true);
                    this.genItems.splice(i, 1);
                    this.status = "item Removed";
                    break;
                }
            }
            if (this.genItems.length == 0) {
                this.setPrices(0, true);
                this.status = "no items";
            }
        }
    }; //addItem
    GeneratorController.prototype.selectVen = function (venSelect) {
        var _this = this;
        if (venSelect != null) {
            this.pickedVendor = true;
            this.status = "Products Retrieved";
            this.genItems = [];
            this.setPrices(0, true);
        }
        this.restsvc.callServer("get", "product/" + venSelect)
            .then(function (response) {
            _this.products = response;
        })
            .catch(function (error) { return _this.status = "Products not retrieved code - " + error; });
        return undefined;
    }; //selectVen
    /*
     * processModal - to process product information after the modal closes
     */
    GeneratorController.prototype.createPO = function () {
        var _this = this;
        this.isPOClick = true;
        this.status = "Wait...";
        var PODTO = {
            vendorNo: this.vendor.vendorNo,
            ponumber: "0",
            items: this.genItems,
            total: parseFloat(this.total),
            date: undefined
        };
        return this.restsvc.callServer("post", "purchaseorder", "", PODTO)
            .then(function (generatedPonumber) {
            if (generatedPonumber > 0) {
                _this.status = "PO " + generatedPonumber + " Created!";
                _this.pono = generatedPonumber;
                _this.generated = true;
            }
            else {
                _this.status = "Problem generating PO, contact purchaing";
            }
        })
            .then(this.selectVen(this.vendor.vendorNo))
            .catch(function (error) { return _this.status = "PO not created - " + error; });
    }; // createPO
    /*
     * processModal - to process product information after the modal closes
     */
    GeneratorController.prototype.viewPdf = function () {
        this.isPOClick = false;
        this.windowsvc.location.href = "http://localhost:8080/APPOCase1/PDFSample?po=" + this.pono;
    }; // createPO
    // static injection
    GeneratorController.$inject = ["RESTService", "$window"];
    return GeneratorController;
}()); // class
//add the controller to the application
app.controller("GeneratorController", GeneratorController);
//# sourceMappingURL=generator.controller.js.map