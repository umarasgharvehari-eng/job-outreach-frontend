import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../core/api';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './applications.html',
  styleUrl: './applications.scss'
})
export class Applications implements OnInit {

  applications: any[] = [];
  filteredApplications: any[] = [];

  constructor(private api: Api) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications() {

    this.api.getApplications().subscribe({

      next: (res: any) => {

        this.applications = res.applications || [];

        this.filteredApplications = [
          ...this.applications
        ];

      },

      error: (err) => {
        console.error(err);
      }

    });

  }

  extractJobTitle(subject: string): string {

    if (!subject) {
      return '-';
    }

    if (subject.includes(':')) {
      return subject.split(':')[1].trim();
    }

    return subject;
  }

}