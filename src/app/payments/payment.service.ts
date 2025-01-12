import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = 'http://127.0.0.1:5000/payments'; // Base URL for payments
  private filesUrl = 'http://127.0.0.1:5000/files'; // Base URL for files

  constructor(private http: HttpClient) {}

  // Fetch Payments
  getPayments(filters: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_payments`, { params: filters });
  }

  // Create Payment
  createPayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create_payment`, paymentData);
  }

  // Update Payment
  updatePayment(paymentId: string, updates: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update_payment`, { _id: paymentId, ...updates });
  }

  // Delete Payment
  deletePayment(paymentId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete_payment/${paymentId}`);
  }

  // Upload Evidence
  uploadEvidence(paymentId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('payment_id', paymentId);
    formData.append('file', file);

    return this.http.post(`${this.filesUrl}/upload_evidence`, formData);
  }

  // Download Evidence
  downloadEvidence(fileId: string): Observable<Blob> {
    return this.http.get(`${this.filesUrl}/download_evidence/${fileId}`, { responseType: 'blob' });
  }
}
