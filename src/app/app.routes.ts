import { Routes } from '@angular/router';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { CustomerloginComponent } from './customerlogin/customerlogin.component';
import { CustomersignupComponent } from './customersignup/customersignup.component';
import { ProductdetailsPageComponent } from './productdetails-page/productdetails-page.component';
import { SellerssigninComponent } from './sellerssignin/sellerssignin.component';
import { SellersignupComponent } from './sellersignup/sellersignup.component';
import { DashboardComponentComponent } from './dashboard-component/dashboard-component.component';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { ViewordersComponent } from './vieworders/vieworders.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { AddproductsComponent } from './addproducts/addproducts.component';
import { sellerguardGuard } from './gaurds/sellerguard.guard';
import { CartpageComponent } from './cartpage/cartpage.component';

export const routes: Routes = [
  { path: '', component: LandingpageComponent },
  { path: 'customersignin', component: CustomerloginComponent },
  { path: 'customersignup', component: CustomersignupComponent },
  { path: 'sellersignup', component: SellersignupComponent },
  { path: 'sellerlogin', component: SellerssigninComponent },
  { path: 'cart', component: CartpageComponent },
  {
      path: 'dashboard',
      component: DashboardComponentComponent,  canActivate:[sellerguardGuard],
      children: [
          { path: '', redirectTo: 'manage-products', pathMatch: 'full'},
          { path: 'manage-products', children: [
            {path: '', component: ManageProductsComponent},
            { path: 'add-products', component: AddproductsComponent },
          ]},
          { path: 'view-orders', component: ViewordersComponent },
          { path: 'profile-settings', component: ProfileSettingsComponent },
          { path: 'add-products', component: AddproductsComponent },
      ],
  },
  { path: ':id', component: ProductdetailsPageComponent }, // Place this last
];

// canActivate:[studentGuard],

