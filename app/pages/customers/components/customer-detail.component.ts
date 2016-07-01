import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {CustomerService} 			from '../customer.service'
import { Customer } from '../customer';
import { Router, ActivatedRoute }       from '@angular/router';

@Component({
  selector: 'customer-detail-cmp',
  template: `
    <div *ngIf="customer">
      <h2>{{customer.first_name}} {{customer.last_name}}</h2>
      <div><label>id: </label>{{customer.customerID}}</div>
      <div>
        <label>name: </label>
        <input [(ngModel)]="customer.first_name" placeholder="name"/>
      </div>
    </div>
    <p>
      <button (click)="goBack()">Back</button>
    </p>
  `
})

export class CustomerDetailComponent implements OnInit {
  @Input() customer: Customer;
  @Output() close = new EventEmitter();
  error: any;
  navigated = false; // true if navigated here

  private sub: any;

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // this.sub = this.route.params.subscribe(params => {
    //   let id = +params['id']; // (+) converts string 'id' to a number
    //   this.customerService.getCustomer(id).then(customer => this.customer = customer);
    // });

    // (+) converts string 'id' to a number
    let id = +this.route.snapshot.params['id'];
    this.customerService.getCustomer(id).then((cus:Customer) => this.customer = cus);
  }

  goBack() { this.router.navigate(['/dashboard/customers']); }

  // ngOnDestroy() {
  //   this.sub.unsubscribe()
  // }

}
