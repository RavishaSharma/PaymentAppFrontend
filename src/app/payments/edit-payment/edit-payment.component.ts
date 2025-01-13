import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.component.html',
  styleUrls: ['./edit-payment.component.css'],
})
export class EditPaymentComponent implements OnInit {
  editPaymentForm!: FormGroup;
  users: any[] = [];
  requiresEvidence: boolean = false;
  evidenceUploaded: boolean = false;
  selectedFile: File | null = null;
  fileError: string = '';

  constructor(private paymentService: PaymentService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchUsers();
  }

  private initializeForm(): void {
    this.editPaymentForm = this.fb.group({
      userId: ['', Validators.required],
      address: [{ value: '', disabled: true }],
      currency: ['', Validators.required],
      dueDate: ['', Validators.required],
      dueAmount: ['', [Validators.required, Validators.min(1)]],
      status: ['', Validators.required],
    });
  }

  private fetchUsers(): void {
    this.paymentService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  onUserIdChange(event: MatSelectChange): void {
    const userId = event.value;
    this.paymentService.getPaymentById(userId).subscribe(
      (data) => {
        this.editPaymentForm.patchValue({
          currency: data.currency,
          dueDate: data.due_date,
          dueAmount: data.due_amount,
          status: data.status,
        });
      },
      (error) => {
        console.error('Error fetching payment details:', error);
      }
    );
  }

  onStatusChange(event: MatSelectChange): void {
    const status = event.value; // Get selected status
    this.requiresEvidence = status === 'completed'; // Set flag if status is 'completed'
  
    if (this.requiresEvidence) {
      this.evidenceUploaded = false; // Reset evidence uploaded state
    }
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      // Perform further actions with the selected file if necessary
    } else {
      this.selectedFile = null;
    }
  }
  debugClick(): void {
    console.log('File input clicked!');
  }
  
    
  uploadEvidence(): void {
    if (!this.selectedFile) {
      this.fileError = 'Please select a file to upload.';
      return;
    }
  
    const formData = new FormData();
    formData.append('payment_id', this.editPaymentForm.value.userId); // Add payment ID
    formData.append('file', this.selectedFile); // Add selected file
  
    this.paymentService.uploadEvidence(this.editPaymentForm.value.userId, this.selectedFile).subscribe(
      (response: any) => {
        this.evidenceUploaded = true; // Mark evidence as uploaded
        this.fileError = ''; // Clear error
        alert('Evidence uploaded successfully!');
      },
      (error) => {
        this.evidenceUploaded = false;
        this.fileError = 'Failed to upload evidence.';
      }
    );
  }
  
  
  onSubmit(): void {
    if (this.requiresEvidence && !this.evidenceUploaded) {
      this.fileError = 'Cannot complete a payment without evidence.';
      return;
    }

    const updates = this.editPaymentForm.getRawValue();
    this.paymentService.updatePayment(updates.userId, updates).subscribe(
      () => {
        alert('Payment updated successfully!');
      },
      (error) => {
        alert('Failed to update payment.');
        console.error(error);
      }
    );
  }
}
