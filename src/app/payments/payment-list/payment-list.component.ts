import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css']
})
export class PaymentListComponent implements OnInit {
  payments: any[] = [];
  filters: any = {};
  displayedColumns: string[] = ['name', 'status', 'dueAmount', 'totalDue', 'actions'];
  totalRecords = 0;
  pageSize = 10;
  currentPage = 1;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.getPayments();
  }

  getPayments(): void {
    this.paymentService.getPayments(this.filters).subscribe(
      (data) => {
        console.log('Backend Response:', data); // Debugging: Check the response
  
        // Validate that `data` is an array before processing
        if (!Array.isArray(data)) {
          console.error('Unexpected data format:', data);
          this.payments = [];
          return;
        }
  
        // Map data to format it for the frontend
        this.payments = data.map((payment: any) => {
          return {
            ...payment,
            payee_full_name: `${payment.payee_first_name || ''} ${payment.payee_last_name || ''}`.trim(),
            status: payment.payee_payment_status, // Remap for frontend usage
          };
        });
  
        console.log('Processed Payments:', this.payments); // Debugging: Check processed payments
      },
      (error) => {
        console.error('Error fetching payments:', error);
      }
    );
  }
  

  searchPayments(): void {
    // Explicitly type filters as Record<string, string | undefined>
    this.filters = Object.fromEntries(
      Object.entries(this.filters).filter(([_, value]) =>
        typeof value === 'string' && value.trim()
      )
    ) as Record<string, string>; // Type assertion to specify the correct type
  
    console.log('Cleaned Filters being sent:', this.filters); // Debugging
    this.getPayments();
  }
  

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getPayments();
  }

  deletePayment(paymentId: string): void {
    this.paymentService.deletePayment(paymentId).subscribe(() => {
      this.getPayments();
    });
  }

  downloadEvidence(fileId: string): void {
    this.paymentService.downloadEvidence(fileId).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'evidence';
      link.click();
    });
  }
}
