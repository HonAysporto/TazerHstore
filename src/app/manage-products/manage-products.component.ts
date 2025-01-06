import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './manage-products.component.html',
  styleUrl: './manage-products.component.css'
})
export class ManageProductsComponent {
  private _snackBar = inject(MatSnackBar);
  public products: any = [];
  public seller: any = {};
  public loading: boolean = true; // For initial fetch
  public isDeleting: boolean[] = []; // For tracking deletion loading states
  public isEditing: boolean = false; // To track if we're in edit mode
  public editingProduct: any = null; // To hold the product being edited
  editloading = false;

  constructor(public http: HttpClient) {}

  ngOnInit() {
    this.seller = JSON.parse(localStorage.getItem('seller')!);

    // Fetch products
    this.http.post('http://localhost/tazerhstore/manageproducts.php', this.seller).subscribe(
      (data: any) => {
        console.log(data);
        this.products = data.msg;
        this.loading = false; // Stop loader after fetching
      },
      (error: any) => {
        console.error(error);
        this.loading = false; // Stop loader even if there's an error
        this._snackBar.open('Error fetching products.', 'Dismiss', { duration: 3000 });
      }
    );
  }

  delete(i: number, productname: string) {
    const product = {
      productname: productname
    };
    this.isDeleting[i] = true; // Start loader for specific product

    this.http.post('http://localhost/tazerhstore/deleteproduct.php', product).subscribe(
      (data: any) => {
        console.log(data);
        this.isDeleting[i] = false; // Stop loader for specific product
        this._snackBar.open(data.msg, 'Continue', { duration: 3000 });

        if (data.status) {
          this.products.splice(i, 1); // Remove product from list
        }
      },
      (error: any) => {
        console.error(error);
        this.isDeleting[i] = false; // Stop loader for specific product
        this._snackBar.open('Error deleting product. Please try again.', 'Dismiss', { duration: 3000 });
      }
    );
  }

  edit(product: any) {
    this.isEditing = true;
    this.editingProduct = { ...product }; // Clone product to avoid direct mutation
  }

  saveChanges() {
    const payload = {
      productname: this.editingProduct.productname,
      details: {
        product_details: this.editingProduct.description,
        product_quantity: this.editingProduct.quantity,
        product_price: this.editingProduct.price,
        product_category: this.editingProduct.category
      }
    };
    this.editloading = true;
    this.http.post('http://localhost/tazerhstore/updateproduct.php', payload).subscribe(
      (data: any) => {

        console.log(data);
        this._snackBar.open(data.msg, 'Continue', { duration: 3000 });
  
        if (data.status) {
          // Update the local product list
          const index = this.products.findIndex(
            (p: any) => p.productname === this.editingProduct.productname
          );
          if (index !== -1) {
            this.products[index] = { ...this.editingProduct }; // Replace the old product with the updated one
          }
          this.cancelEdit();
          this.editloading = false;
        }
      },
      (error: any) => {
        console.error(error);
        this._snackBar.open('Error updating product. Please try again.', 'Dismiss', { duration: 3000 });
      }
    );
  }
  
  cancelEdit() {
    this.isEditing = false;
    this.editingProduct = null;
  }
  
}
