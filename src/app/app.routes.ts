import { Routes } from '@angular/router';

import { MainLayoutComponent } from './layout/main-layout/main-layout';

import { OverviewComponent } from './pages/overview/overview';
import { NewJobsComponent } from './pages/new-jobs/new-jobs';
import { Applications } from './pages/applications/applications';
import { FollowupsComponent } from './pages/followups/followups';
import { ReportsComponent } from './pages/reports/reports';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [

      {
        path: '',
        component: OverviewComponent
      },

      {
        path: 'new-jobs',
        component: NewJobsComponent
      },

      {
        path: 'applications',
        component: Applications
      },

      {
        path: 'followups',
        component: FollowupsComponent
      },

      {
        path: 'reports',
        component: ReportsComponent
      }

    ]
  }
];