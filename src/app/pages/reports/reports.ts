import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.scss']
})
export class ReportsComponent implements OnInit {
  summary: any = {};
  applications: any[] = [];
  loading = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports() {
    this.loading = true;

    this.http.get<any>('http://127.0.0.1:8000/api/dashboard/summary')
      .subscribe({
        next: (summary) => {
          this.summary = summary || {};
          this.loadApplications();
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  loadApplications() {
    this.http.get<any>('http://127.0.0.1:8000/api/applications?limit=300')
      .subscribe({
        next: (res) => {
          this.applications = res.applications || [];
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  get replyRate(): number {
    const applied = Number(this.summary.appliedJobs || 0);
    const replies = Number(this.summary.totalReplies || 0);
    return applied ? Math.round((replies / applied) * 100) : 0;
  }

  get outreachCoverage(): number {
    const total = Number(this.summary.totalJobsFound || 0);
    const applied = Number(this.summary.appliedJobs || 0);
    return total ? Math.round((applied / total) * 100) : 0;
  }

  get pendingRate(): number {
    const applied = Number(this.summary.appliedJobs || 0);
    const pending = Number(this.summary.pendingFollowups || 0);
    return applied ? Math.round((pending / applied) * 100) : 0;
  }

  exportSummaryCsv() {
    const rows = [
      ['Metric', 'Value'],
      ['Total Jobs Found', this.summary.totalJobsFound || 0],
      ['Applied Jobs', this.summary.appliedJobs || 0],
      ['UK Jobs', this.summary.ukJobs || 0],
      ['Total Replies', this.summary.totalReplies || 0],
      ['Pending Follow-ups', this.summary.pendingFollowups || 0],
      ['Follow-ups Sent', this.summary.followupsSent || 0],
      ['New Jobs Not Emailed', this.summary.newJobsNotEmailed || 0],
      ['Reply Rate', `${this.replyRate}%`],
      ['Outreach Coverage', `${this.outreachCoverage}%`],
      ['Pending Follow-up Rate', `${this.pendingRate}%`]
    ];

    this.downloadCsv(rows.map(row => row.join(',')).join('\n'), 'summary-report.csv');
  }

  exportApplicationsCsv() {
    if (!this.applications.length) {
      alert('No applications available to export.');
      return;
    }

    const columns = Object.keys(this.applications[0]);
    const rows = this.applications.map(row =>
      columns.map(col => `"${String(row[col] ?? '').replace(/"/g, '""')}"`).join(',')
    );

    this.downloadCsv([columns.join(','), ...rows].join('\n'), 'applications-report.csv');
  }

  downloadCsv(csv: string, filename: string) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    window.URL.revokeObjectURL(url);
  }
}