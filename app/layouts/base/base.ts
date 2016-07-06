import {Component, ViewEncapsulation, ViewContainerRef} from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

import {LoginComponent} from '../../pages/login/components/login';
import {SignupComponent} from '../../pages/signup/components/signup';
import {DashboardComponent} from '../dashboard/components/dashboard';

import {CustomerService} from '../../pages/customers/customer.service'
import {DeviceService} from '../../pages/devices/device.service'

@Component({
	moduleId: module.id,
    selector: 'sd-app',
    templateUrl: 'base.html',
    encapsulation: ViewEncapsulation.None,
		providers: [
			CustomerService,
			DeviceService,
			HTTP_PROVIDERS
		],
    directives: [ROUTER_DIRECTIVES]
})

export class AppComponent {
	viewContainerRef: any = null;
	public constructor(viewContainerRef:ViewContainerRef) {
	    // You need this small hack in order to catch application root view container ref
	    this.viewContainerRef = viewContainerRef;
	}
}
