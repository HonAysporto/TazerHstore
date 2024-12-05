import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private selectedProduct: any;

  setProduct(product:any) {
    this.selectedProduct = product
  }

  getProduct() {
    return this.selectedProduct
  }

  constructor() { }
}
