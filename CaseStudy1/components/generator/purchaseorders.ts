/**
  * GeneratorItem - container class for line item in generator
  */
interface PoDTO {
    // class members
    vendorNo: number;
    ponumber: string;
    items: GeneratorItem[];
    total: number;
    date: Date;
}