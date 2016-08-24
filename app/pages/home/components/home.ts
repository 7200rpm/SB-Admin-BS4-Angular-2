import {Component, OnInit} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from '@angular/common';
import {CAROUSEL_DIRECTIVES, DROPDOWN_DIRECTIVES, AlertComponent} from 'ng2-bootstrap/ng2-bootstrap';

import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';

import { Router, ActivatedRoute }       from '@angular/router';

import {DashboardService} 			from '../dashboard.service'
import {Customer} 						from '../../customers/customer'

import {AuthService} from '../../login/auth.service';
import {AuthHttp} from 'angular2-jwt';

@Component({
	moduleId: module.id,
	selector: 'timeline-cmp',
	templateUrl: 'timeline.html',
	styleUrls: ['timeline.css'],
})
class TimelineComponent { }

@Component({
	moduleId: module.id,
	selector: 'chat-cmp',
	templateUrl: 'chat.html',
	directives: [CORE_DIRECTIVES, DROPDOWN_DIRECTIVES]
})
class ChatComponent { }

@Component({
	moduleId: module.id,
	selector: 'notifications-cmp',
	templateUrl: 'notifications.html',
	styleUrls: ['home.css'],
})
class NotificationComponent { }


@Component({
	moduleId: module.id,
	selector: 'home-cmp',
	templateUrl: 'home.html',
	styleUrls: ['home.css'],
	directives: [
		AlertComponent,
		TimelineComponent,
		ChatComponent,
		NotificationComponent,
		CAROUSEL_DIRECTIVES,
		CORE_DIRECTIVES,
		FORM_DIRECTIVES,
		CHART_DIRECTIVES]
})

export class HomeComponent implements OnInit {

	public total_customers: number = 0;
	public unfulfilled_orders: number = 0;
	public total_devices: number = 0;
	public shipped_devices: number = 0;

	dash_items: any;
	numShipped: any;
	numStock: any;

	public numCustomers: number = 0;
	public numUnfulfilledOrders: number = 0;
	public numDevices: number = 0;
	public numShippedDevices: number = 0;

	constructor(private auth: AuthService, private dashboardService: DashboardService, private router: Router) {

		// First, check if there is already a JWT in local storage
		// var idToken = localStorage.getItem('id_token');
		// var authHash = this.auth.hash(window.location.hash);

		// // If there is no JWT in local storage and there is one in the URL hash,
		// // save it in local storage
		// if (!idToken && authHash) {
		// 	if (authHash.id_token) {
		// 		idToken = authHash.id_token
		// 		localStorage.setItem('id_token', authHash.id_token);
		// 	}
		// 	if (authHash.error) {
		// 		// Handle any error conditions
		// 		console.log("Error signing in", authHash);
		// 	}
		// }
	}

	ngOnInit() { 
		this.getDashboard();
	 }

	getDashboard() {
		this.dashboardService.getDashboard()
			.subscribe(
			items => {
				this.dash_items = items;
				console.log(this.dash_items);
				this.getStatistics();
			},
			error => { console.log("Error: " + error) },
			() => console.log('Dashboard Completed!')
			)
	}

	getStatistics() {
		for(var i = 0; i < this.dash_items.customers.length; i++) {
			this.numCustomers++;
			if(this.dash_items.customers[i].order_status == "Unfulfilled") {
				this.numUnfulfilledOrders++;
			}
		}
		for(var i = 0; i < this.dash_items.devices.length; i++) {
			this.numDevices++;
			if(this.dash_items.devices[i].customer_name != null) {
				this.numShippedDevices++;
			}
		}
	}
}
