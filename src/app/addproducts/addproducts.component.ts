import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';


@Component({
  selector: 'app-addproducts',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './addproducts.component.html',
  styleUrls: ['./addproducts.component.css'],
})
export class AddproductsComponent {
  addProductForm: FormGroup;
  categories = ['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty & Health'];
  selectedFile: File | null = null;
  seller: any = {};
  loading = false; // Add loading state

  private _snackBar = inject(MatSnackBar);

ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    this.seller = JSON.parse(localStorage.getItem('seller') || '{}');
  }
}

  constructor(private fb: FormBuilder, private http: HttpClient,  @Inject(PLATFORM_ID) private platformId: Object) {
    this.addProductForm = this.fb.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      file: [null, Validators.required],
      quantity: [, Validators.required],
    });
  }

  onFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.selectedFile = file ? file : null;
  }

  onSubmit() {
    if (this.addProductForm.valid && this.selectedFile) {
      this.loading = true; // Start loader
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('upload_preset', 'TAZERSTORE'); // Replace with your Cloudinary preset

      // Step 1: Upload the image to Cloudinary
      this.http.post('https://api.cloudinary.com/v1_1/dkcod39ah/image/upload', formData).subscribe(
        (response: any) => {
          const imageUrl = response.secure_url;

          // Step 2: Submit product details along with the image URL to the backend
          const productData = {
            ...this.addProductForm.value,
            imagePath: imageUrl,
            sellerid: this.seller.sellers_id,
          };

          this.http.post('http://localhost/tazerhstore/addproduct.php', productData).subscribe(
            (data: any) => {
              this._snackBar.open(data.msg, 'Continue', { duration: 3000 });
              this.addProductForm.reset();
              this.loading = false; 
            },
            (error) => {
              console.error('Error saving product:', error);
              this.loading = false; 
            }
          );
        },
        (error) => {
          console.error('Error uploading image to Cloudinary:', error);
          this.loading = false; 
        }
      );
    } else {
      alert('Please complete the form before submitting!');
    }
  }
}
