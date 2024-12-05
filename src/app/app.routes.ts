import { Routes } from '@angular/router';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { CustomerloginComponent } from './customerlogin/customerlogin.component';
import { CustomersignupComponent } from './customersignup/customersignup.component';
import { ProductdetailsPageComponent } from './productdetails-page/productdetails-page.component';

export const routes: Routes = [

    {path:'', component:LandingpageComponent},
    {path:'customersignin', component:CustomerloginComponent},
    {path:'customersignup', component:CustomersignupComponent},
    {path:':id', component:ProductdetailsPageComponent},

];
