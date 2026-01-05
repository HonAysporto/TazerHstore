import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css'] // fixed typo
})
export class ManageProductsComponent {
  private _snackBar = inject(MatSnackBar);
  private platformId: Object = inject(PLATFORM_ID);

  public products: any[] = [];
  public seller: any = {};
  public loading: boolean = true;
  public isDeleting: boolean[] = [];
  public isEditing: boolean = false;
  public editingProduct: any = null;
  public editloading = false;

  constructor(public http: HttpClient) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const sellerStr = localStorage.getItem('seller');
      this.seller = sellerStr ? JSON.parse(sellerStr) : {};
    }

    // Fetch products
    this.http.post('https://tazerhstorephp.onrender.com/manageproducts.php', this.seller).subscribe(
      (data: any) => {
        console.log(data);
        this.products = data.msg || [];
        this.loading = false;
      },
      (error: any) => {
        console.error(error);
        this.loading = false;
        this._snackBar.open('Error fetching products.', 'Dismiss', { duration: 3000 });
      }
    );
  }

  delete(i: number, productname: string) {
    const product = { productname };
    this.isDeleting[i] = true;

    this.http.post('https://tazerhstorephp.onrender.com/deleteproduct.php', product).subscribe(
      (data: any) => {
        console.log(data);
        this.isDeleting[i] = false;
        this._snackBar.open(data.msg, 'Continue', { duration: 3000 });

        if (data.status) {
          this.products.splice(i, 1);
        }
      },
      (error: any) => {
        console.error(error);
        this.isDeleting[i] = false;
        this._snackBar.open('Error deleting product. Please try again.', 'Dismiss', { duration: 3000 });
      }
    );
  }

  edit(product: any) {
    this.isEditing = true;
    this.editingProduct = { ...product };
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

    this.http.post('https://tazerhstorephp.onrender.com/updateproduct.php', payload).subscribe(
      (data: any) => {
        console.log(data);
        this._snackBar.open(data.msg, 'Continue', { duration: 3000 });

        if (data.status) {
          const index = this.products.findIndex(
            (p: any) => p.productname === this.editingProduct.productname
          );
          if (index !== -1) {
            this.products[index] = { ...this.editingProduct };
          }
          this.cancelEdit();
        }

        this.editloading = false;
      },
      (error: any) => {
        console.error(error);
        this._snackBar.open('Error updating product. Please try again.', 'Dismiss', { duration: 3000 });
        this.editloading = false;
      }
    );
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingProduct = null;
  }
}
