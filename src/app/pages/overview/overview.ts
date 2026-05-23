import { Component, OnInit } from '@angular/core';
import { Api } from '../../core/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.html',
  styleUrl: './overview.scss'
})
export class OverviewComponent implements OnInit {
  state: any = {};
  summary: any = {};
  logs: string[] = [];
  loading = false;

  constructor(private api: Api) {}

  ngOnInit() {
    this.refreshAll();
    setInterval(() => this.refreshAll(), 30000);
  }

  refreshAll() {
    this.loadState();
    this.loadSummary();
    this.loadLogs();
  }

  loadState() {
    this.api.getState().subscribe({
      next: (res) => this.state = res || {}
    });
  }

  loadSummary() {
    this.api.getDashboardSummary().subscribe({
      next: (res) => this.summary = res || {}
    });
  }

  loadLogs() {
    this.api.getLogs(8).subscribe({
      next: (res) => this.logs = res.logs || []
    });
  }

  startWorker() {
    this.loading = true;
    this.api.startWorker().subscribe({
      next: () => {
        this.loading = false;
        this.refreshAll();
      },
      error: () => this.loading = false
    });
  }

  stopWorker() {
    this.loading = true;
    this.api.stopWorker().subscribe({
      next: () => {
        this.loading = false;
        this.refreshAll();
      },
      error: () => this.loading = false
    });
  }

  runInboxSync() {
    this.loading = true;
    this.api.runInboxSync().subscribe({
      next: () => {
        this.loading = false;
        this.refreshAll();
      },
      error: () => this.loading = false
    });
  }

  get workerHealth() {
    if (!this.state.running) return 'Stopped';
    if (this.state.last_job_status === 'failed' || this.state.last_job_status === 'error') return 'Needs Attention';
    if (this.state.job_lock) return 'Sync Running';
    return 'Healthy';
  }

  get nextSyncTime() {
    const schedule = this.state.schedule || [];
    const inbox = schedule.find((x: any) => String(x.job || '').includes('job_inbox_fast'));
    return inbox?.next_run || '-';
  }
}