import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-jobs',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './new-jobs.html',
  styleUrls: ['./new-jobs.scss']
})
export class NewJobsComponent implements OnInit {

  jobs: any[] = [];

  loading = false;
  applying = false;

  reviewOpen = false;
  reviewJobs: any[] = [];

  attachCv = true;

  customMessage = `Hi Hiring Team,

I hope you are doing well.

I would like to apply for this position. Please find my resume attached.

Best regards,`;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs() {

    this.loading = true;

    this.http.get<any>(
      'http://127.0.0.1:8000/api/jobs/new'
    ).subscribe({
      next: (res) => {

        this.jobs = (res.jobs || []).map((j: any) => ({
          ...j,
          selected: false
        }));

        this.loading = false;
      },

      error: (err) => {

        console.error(err);

        this.loading = false;
      }
    });
  }

  toggleSelection(job: any) {
    job.selected = !job.selected;
  }

  selectAll() {
    this.jobs.forEach(job => {
      job.selected = true;
    });
  }

  clearSelection() {
    this.jobs.forEach(job => {
      job.selected = false;
    });
  }

  get selectedCount(): number {
    return this.jobs.filter(j => j.selected).length;
  }

  openReview() {

    const selected = this.jobs.filter(
      j => j.selected
    );

    if (!selected.length) {

      alert(
        'Please select at least one job'
      );

      return;
    }

    this.reviewJobs = selected;

    this.attachCv = true;

    this.reviewOpen = true;
  }

  closeReview() {
    this.reviewOpen = false;
  }

  applySelected() {

    const selectedJobs = this.jobs.filter(
      j => j.selected
    );

    if (!selectedJobs.length) {
      return;
    }

    this.applying = true;

    this.http.post<any>(
      'http://127.0.0.1:8000/api/jobs/apply',
      {
        jobs: selectedJobs,
        message: this.customMessage,
        attach_resume: this.attachCv
      }
    ).subscribe({
      next: (res) => {

        this.applying = false;

        this.reviewOpen = false;

        alert(
          `Sent: ${res.sent_count || 0}
Skipped: ${res.skipped_count || 0}
Failed: ${res.failed_count || 0}`
        );

        this.loadJobs();
      },

      error: (err) => {

        console.error(err);

        this.applying = false;

        alert(
          'Application sending failed'
        );
      }
    });
  }

  copyMessage(job: any) {

    const text = `${this.customMessage}

Job: ${job.title || 'Untitled Job'}
Company: ${job.company || 'Unknown Company'}
Link: ${job.link || '-'}`;

    navigator.clipboard.writeText(text);

    alert(
      'Message copied successfully.'
    );
  }

  markApplied(job: any) {

    this.http.post<any>(
      'http://127.0.0.1:8000/api/jobs/mark-applied',
      {
        job,
        note: this.customMessage
      }
    ).subscribe({
      next: () => {

        alert(
          'Job marked as manually applied.'
        );

        this.loadJobs();
      },

      error: (err) => {

        console.error(err);

        alert(
          'Failed to mark job as applied.'
        );
      }
    });
  }

  getTitle(job: any): string {
    return job.title || 'Untitled';
  }

  getCompany(job: any): string {
    return job.company || '-';
  }

  getLocation(job: any): string {
    return job.location || '-';
  }

  getSource(job: any): string {
    return job.source || '-';
  }

  getDescription(job: any): string {
    return job.description || '';
  }
}