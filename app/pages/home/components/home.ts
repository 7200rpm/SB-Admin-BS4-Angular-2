import { Component, OnInit, ViewChild } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from '@angular/common';
import { CAROUSEL_DIRECTIVES, DROPDOWN_DIRECTIVES, AlertComponent } from 'ng2-bootstrap/ng2-bootstrap';

import { CHART_DIRECTIVES } from 'ng2-charts/ng2-charts';
import { GoogleChartComponent } from '../../devices/components/ng2-google-charts';

import { Router, ActivatedRoute } from '@angular/router';

import { DashboardService } from '../dashboard.service'
import { Customer } from '../../customers/customer'

import { AuthService } from '../../login/auth.service';
import { AuthHttp } from 'angular2-jwt';

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
		CHART_DIRECTIVES,
		GoogleChartComponent]
})

export class HomeComponent implements OnInit {

	dash_items: any = [];
	numShipped: any;
	numStock: any;

	public numCustomers: number = 0;
	public numUnfulfilledOrders: number = 0;
	public numDevices: number = 0;
	public numShippedDevices: number = 0;

	public numActiveDevices: number = 0;
	public numWakeups: number = 0;
	public numFailedWakeups: number = 0;

	public wakeupImageUri: string;

	@ViewChild('wakeupContainer') wakeupContainer: any;
	@ViewChild('wakeupChart', { read: GoogleChartComponent }) wakeupChart: GoogleChartComponent;

	public chartOptions = {
		title: 'Wakeups',
		width: 800,
		height: 640,
		legend: { position: 'bottom' },
		animation: {
			duration: 1000,
			easing: 'out',
		},
		hAxis: {
			title: 'Window Time (Local)',
		},
		/*
		series: {
			0: { targetAxisIndex: 0 },
			1: { targetAxisIndex: 1 }
		},
		*/
		vAxes: {
			// Adds titles to each axis.
			0: { title: 'Wakeups Per 24 Hour Window' }
		},
		bar: { groupWidth: '75%' },
		isStacked: true
	};

	public chartData: any[];

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

	ngAfterViewInit() {
		this.chartOptions.width = this.wakeupContainer.nativeElement.clientWidth;
	}

	getDashboard() {
		this.dashboardService.getDashboard()
			.subscribe(
			items => {
				this.dash_items = items;
				console.log(this.dash_items);
				// this.getStatistics();
				this.chartData = this.loadChartData();
				this.numDevices = this.dash_items.totalDevices;
				this.numActiveDevices = this.dash_items.activeDevices;
				this.numWakeups = this.dash_items.successfulWakeups;
				this.numFailedWakeups = this.dash_items.failedWakeups;
			},
			error => { console.log("Error: " + error) },
			() => console.log('Dashboard Completed!')
			)
	}

	getStatistics() {
		for (var i = 0; i < this.dash_items.customers.length; i++) {
			this.numCustomers++;
			if (this.dash_items.customers[i].order_status == "Unfulfilled") {
				this.numUnfulfilledOrders++;
			}
		}
		for (var i = 0; i < this.dash_items.devices.length; i++) {
			this.numDevices++;
			if (this.dash_items.devices[i].customer_name != null) {
				this.numShippedDevices++;
			}
		}
	}

	loadChartData() {
		var data_out = new Array();
		data_out.push(new Array('Timestamp', 'Successful Wakeups', 'Failed Wakeups'));
		console.log(this.dash_items.wakeupStatistics[0]);
		for (var i = 0; i < this.dash_items.wakeupStatistics.length; i++) {

			var value = new Array(new Date(this.dash_items.wakeupStatistics[i].startTime), this.dash_items.wakeupStatistics[i].successfulWakeups, this.dash_items.wakeupStatistics[i].failedWakeups);
			data_out.push(value);
		}

		return data_out;
	}

	viewWakeupChart() {
		window.open(this.wakeupChart.imageURI);
	}
}
