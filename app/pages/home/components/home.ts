import {Component, OnInit} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from '@angular/common';
import {CAROUSEL_DIRECTIVES, DROPDOWN_DIRECTIVES, AlertComponent} from 'ng2-bootstrap/ng2-bootstrap';

import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';

import {CustomerService} 			from '../../customers/customer.service'
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

	customers: Customer[] = [];
	numShipped: any;
	numStock: any;
	/* Carousel Variable */
	myInterval: number = 5000;
	index: number = 0;
	slides: Array<any> = [];
	imgUrl: Array<any> = [
		`assets/img/slider1.jpg`,
		`assets/img/slider2.jpg`,
		`assets/img/slider3.jpg`,
		`assets/img/slider0.jpg`
	];

	public chartLabels: string[] = ['Shipped', 'Unfulfilled']
	public chartData: number[];
	public chartType: string = 'pie';
	/* END */
	/* Alert component */
	public alerts: Array<Object> = [
		{
			type: 'danger',
			msg: 'Oh snap! Change a few things up and try submitting again.'
		},
		{
			type: 'success',
			msg: 'Well done! You successfully read this important alert message.',
			closable: true
		}
	];

	public closeAlert(i: number): void {
		this.alerts.splice(i, 1);
	}
	/* END*/

	constructor(private auth: AuthService, private customerService: CustomerService) {

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


		for (let i = 0; i < 4; i++) {
			this.addSlide();
		}
	}

	/* Carousel */
	addSlide() {
		let i = this.slides.length;
		this.slides.push({
			image: this.imgUrl[i],
			text: `${['Dummy ', 'Dummy ', 'Dummy ', 'Dummy '][this.slides.length % 4]}
      			${['text 0', 'text 1', 'text 2', 'text 3'][this.slides.length % 4]}`
		});
	}

	ngOnInit() { this.getCustomers() }

	getCustomers() {
		this.customerService.getCustomers()
			.subscribe(
			customers => {
				this.customers = customers;
				this.setupChart();
			},
			error => { console.log("Error: " + error) },
			() => console.log('Customers Completed!')
			)
	}

	private setupChart(): void {
		this.numShipped = this.customers.filter(c => c.order_status == "Shipped").length;
		this.numStock = this.customers.filter(c => c.order_status == "Unfulfilled").length;

		this.chartData = [this.numShipped, this.numStock]
	}


	// events
	public chartClicked(e: any): void {

	}

	public chartHovered(e: any): void {

	}
	/* END */
}
