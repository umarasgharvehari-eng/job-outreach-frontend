import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-followups',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './followups.html',
  styleUrls: ['./followups.scss']
})
export class FollowupsComponent implements OnInit {

  followups: any[] = [];
  selectedFollowups: any[] = [];

  loading = false;
  sending = false;

  sendResult: any = null;

  customMessage = `Hi,

I hope you are doing well.

I wanted to follow up regarding my previous application.

Looking forward to your response.

Best regards,
Umar`;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadFollowups();
  }

  loadFollowups() {

    this.loading = true;

    this.http.get<any>('http://127.0.0.1:8000/api/followups/due')
      .subscribe({
        next: (res) => {

          this.followups = res.followups || [];
          this.selectedFollowups = [];

          this.loading = false;
        },
        error: (err) => {

          console.error(err);

          this.loading = false;
        }
      });
  }

  toggleSelection(item: any) {

    item.selected = !item.selected;

    this.selectedFollowups = this.followups.filter(
      f => f.selected
    );
  }

  selectAll() {

    this.followups.forEach(item => {
      item.selected = true;
    });

    this.selectedFollowups = [...this.followups];
  }

  clearSelection() {

    this.followups.forEach(item => {
      item.selected = false;
    });

    this.selectedFollowups = [];
  }

  sendFollowups() {

    const selected = this.followups.filter(
      f => f.selected
    );

    if (!selected.length) {
      return;
    }

    this.sending = true;

    this.sendResult = null;

    this.http.post<any>(
      'http://127.0.0.1:8000/api/followups/send',
      {
        followups: selected,
        message: this.customMessage
      }
    ).subscribe({
      next: (res) => {

        this.sendResult = res;

        this.sending = false;

        alert(
          `Sent: ${res.sent_count}, Skipped: ${res.skipped_count}, Failed: ${res.failed_count}`
        );

        this.loadFollowups();
      },

      error: (err) => {

        console.error(err);

        this.sending = false;

        alert('Follow-up sending failed');
      }
    });
  }

  getTitle(item: any): string {

    return (
      item.subject ||
      item.job_title ||
      item.title ||
      'Untitled'
    );
  }

  getEmail(item: any): string {

    return (
      item.to_email ||
      item.email ||
      item.contact_email ||
      '-'
    );
  }

  getDate(item: any): string {

    return (
      item.followup_due_at ||
      item.follow_up_due_at ||
      item.sent_at ||
      '-'
    );
  }
}