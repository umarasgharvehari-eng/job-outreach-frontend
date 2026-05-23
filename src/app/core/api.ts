import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private baseUrl = 'stellar-elegance-production-717d.up.railway.app';

  constructor(private http: HttpClient) {}

  getState(): Observable<any> {
    return this.http.get(`${this.baseUrl}/state`);
  }

  getDashboardSummary(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/summary`);
  }

  getLogs(limit = 200): Observable<any> {
    return this.http.get(`${this.baseUrl}/logs?limit=${limit}`);
  }

  getNewJobs(limit = 100): Observable<any> {
  return this.http.get(`${this.baseUrl}/jobs/new?limit=${limit}`);
}

  startWorker(): Observable<any> {
    return this.http.post(`${this.baseUrl}/worker/start`, {});
  }

  stopWorker(): Observable<any> {
    return this.http.post(`${this.baseUrl}/worker/stop`, {});
  }

  runInboxSync(): Observable<any> {
    return this.http.post(`${this.baseUrl}/jobs/inbox-sync`, {});
  }
  getApplications(limit = 200): Observable<any> {
  return this.http.get(`${this.baseUrl}/applications?limit=${limit}`);
}
}
