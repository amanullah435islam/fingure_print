//  import { Routes } from '@angular/router';
// import { authGuard } from './core/auth.guard';

// export const routes = [
//   {
//     path: 'dashboard',
//     //canActivate: [authGuard], // 🔥 এইটা important
//     loadComponent: () => import('./cmponent/dashboard-component/dashboard-component')  
//       .then(m => m.DashboardComponent)  

//   }
// ];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./cmponent/dashboard-component/dashboard-component')
        .then(m => m.DashboardComponent)
  }
];