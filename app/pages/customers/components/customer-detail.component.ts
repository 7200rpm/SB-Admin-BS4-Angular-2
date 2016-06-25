import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {CustomerService} 			from '../customer.service'
import { Customer } from '../customer';
import { Router, ActivatedRoute }       from '@angular/router';

@Component({
  selector: 'customer-detail-cmp',
  template: `
    <div *ngIf="customer">
      <h2>{{customer.name}} details!</h2>
      <div><label>id: </label>{{customer.id}}</div>
      <div>
        <label>name: </label>
        <input [(ngModel)]="customer.name" placeholder="name"/>
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
    this.customerService.getCustomer(id).then(customer => this.customer = customer);
  }

  goBack() { this.router.navigate(['/customers']); }

  // ngOnDestroy() {
  //   this.sub.unsubscribe()
  // }

}
