import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentListComponent } from './payments/payment-list/payment-list.component';

const routes: Routes = [
  { path: 'payments', component: PaymentListComponent },
  { path: '', redirectTo: '/payments', pathMatch: 'full' },
  { path: '**', redirectTo: '/payments' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
