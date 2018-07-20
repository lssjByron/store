/**
  * Product - interface for product information
  */
interface Product {
    productCode: string;
    vendorNo: number;
    vendorsku: string;
    productName: string;
    costPrice: number;
    MSRP: number;
    ROP: number;
    EOQ: number;
    QOH: number;
    QOO: number;
    qrCode: Blob;
}