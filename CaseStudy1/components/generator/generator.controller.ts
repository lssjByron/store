/**
  * Product Controller
  * - controller for product.html partial
  */
class GeneratorController {
    // static injection
    static $inject = ["RESTService", "$window"];

    //members
    products: Product[];
    status: string;
    product: Product;
    vendor: Vendor;
    vendors: Vendor[];
    genItems: GeneratorItem[];
    quantity: string;
    pickedVendor: boolean;
    isAddClick: boolean;
    pono: number;
    generated: boolean;
    sub: string;
    tax: string;
    total: string;
    isPOClick: boolean;

    /**
     * constructor
     * @param restsvc: application service for processing all REST calls
     * @param modal: angular-ui modal service
     * @param filter: angular filter service for sorting cols asc/desc
     */
    constructor(public restsvc: RESTService, public windowsvc: ng.IWindowService) {
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
    public loadProducts(msg?: string) {
        return this.restsvc.callServer("get", "product")
            .then((response: Product[]) => {
                this.products = response;
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


    public setPrices(baseprice: number, isMinus: boolean) {
        if (isMinus == true)
            this.sub = (parseFloat(this.sub) - baseprice).toFixed(2);
        else
            this.sub = (parseFloat(this.sub) + baseprice).toFixed(2);

        if (baseprice == 0) {
            this.sub = "0";
            this.isAddClick = false
        }

        this.tax = (Math.round((parseFloat(this.sub) * 0.13) * 100) / 100).toFixed(2);
        this.total = (Math.round((parseFloat(this.sub) + parseFloat(this.tax)) * 100) / 100).toFixed(2);
    }

    public addItem() {
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

    } //addItem


    public selectVen(venSelect: number) {
        if (venSelect != null) {
            this.pickedVendor = true;
            this.status = "Products Retrieved";
            this.genItems = [];
            this.setPrices(0, true);
        }
        this.restsvc.callServer("get", "product/" + venSelect)
            .then((response: Product[]) => {
                this.products = response;
            })
            .catch((error: any) => this.status = "Products not retrieved code - " + error);
        return undefined;
    }//selectVen


    /*
     * processModal - to process product information after the modal closes
     */
    createPO() {
        this.isPOClick = true;
        this.status = "Wait...";
        var PODTO: PoDTO = {
            vendorNo: this.vendor.vendorNo,
            ponumber: "0",
            items: this.genItems,
            total: parseFloat(this.total),
            date: undefined
        };

        return this.restsvc.callServer("post", "purchaseorder", "", PODTO)
            .then((generatedPonumber: number) => {
                if (generatedPonumber > 0) {
                    this.status = "PO " + generatedPonumber + " Created!";
                    this.pono = generatedPonumber;
                    this.generated = true;
                } else {
                    this.status = "Problem generating PO, contact purchaing";
                }
            })
            .then(this.selectVen(this.vendor.vendorNo))
            .catch((error: any) => this.status = "PO not created - " + error);        
    } // createPO

    /*
     * processModal - to process product information after the modal closes
     */
    viewPdf() {
        this.isPOClick = false;
        this.windowsvc.location.href = "http://localhost:8080/APPOCase1/PDFSample?po=" + this.pono;
    } // createPO
  
} // class


//add the controller to the application
app.controller("GeneratorController", GeneratorController);