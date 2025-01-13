import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.css']
})
export class AddPaymentComponent implements OnInit {
  payment: any = {
    payee_payment_status: 'pending', // Default status
    payee_due_date: null, // Ensure this field is reset
  };
  currencies: string[] = ['USD', 'EUR', 'INR', 'JPY', 'GBP', 'AUD', 'CAD'];

  constructor(private paymentService: PaymentService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.validatePayment()) {
      this.paymentService.addPayment(this.payment).subscribe(
        () => {
          this.snackBar.open('Payment added successfully', 'Close', { duration: 3000 });
          this.resetForm();
        },
        (error) => {
          console.error('Error adding payment:', error);
          this.snackBar.open('Error adding payment', 'Close', { duration: 3000 });
        }
      );
    }
  }

  validatePayment(): boolean {
    if (
      !this.payment.payee_first_name ||
      !this.payment.payee_last_name ||
      !this.payment.due_amount ||
      !this.payment.currency ||
      !this.payment.payee_due_date
    ) {
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return false;
    }

    return true;
  }

  validatePhoneNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Replace non-numeric characters with an empty string
    input.value = input.value.replace(/[^0-9]/g, '');
    // Ensure the phone number doesn't exceed 10 digits
    if (input.value.length > 10) {
      input.value = input.value.substring(0, 10);
    }
    this.payment.payee_phone_number = input.value; // Update the model
  }
  

  resetForm(): void {
    this.payment = {
      payee_payment_status: 'pending',
      payee_due_date: null,
    };
  }

  showStatusWarning(): void {
    this.snackBar.open('Status is set to "Pending" and cannot be modified.', 'Close', { duration: 3000 });
  }
}
