import { provideRouter, RouterConfig } from '@angular/router';

import {LoginComponent} from '../../pages/login/components/login';
import {SignupComponent} from '../../pages/signup/components/signup';
import {DashboardComponent} from '../dashboard/components/dashboard';

import {HomeComponent} from '../../pages/home/components/home';
import {ChartComponent} from '../../pages/charts/components/charts';
import {GridComponent} from '../../pages/grid/components/grid';
import {FormComponent} from '../../pages/forms/components/forms';
import {TableComponent} from '../../pages/tables/components/tables';
import {CustomerComponent} from '../../pages/customers/components/customers.component';
import {BSElementComponent} from '../../pages/bootstrap-element/components/bs_element';
import {BlankPageComponent} from '../../pages/blank-page/components/blank_page';
import {NG2Component} from '../../pages/component/components/component';

export const routes: RouterConfig = [
  { path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'dashboard', component: DashboardComponent, children: [
      { path: 'home', component: HomeComponent },
      { path: 'chart', component: ChartComponent },
      { path: 'customers', component: CustomerComponent },
      { path: 'table', component: TableComponent },
      { path: 'forms', component: FormComponent },
      { path: 'element', component: BSElementComponent },
      { path: 'grid', component: GridComponent },
      { path: 'component', component: NG2Component },
      { path: 'blank-page', component: BlankPageComponent }
    ]
  }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
