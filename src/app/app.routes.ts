import { Routes } from '@angular/router';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { CustomerloginComponent } from './customerlogin/customerlogin.component';
import { CustomersignupComponent } from './customersignup/customersignup.component';

export const routes: Routes = [

    {path:'', component:LandingpageComponent},
    {path:'customersignin', component:CustomerloginComponent},
    {path:'customersignup', component:CustomersignupComponent}
];
