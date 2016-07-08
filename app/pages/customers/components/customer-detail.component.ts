import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {CustomerService} 			from '../customer.service'
import { Customer } from '../customer';
import { Router, ActivatedRoute }       from '@angular/router';
import { Observable }     from 'rxjs/Observable';

@Component({
  selector: 'customer-detail-cmp',
  templateUrl: 'customer-detail.component.html'
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

    // this.route.params
    //   .map(params => params['id'])
    //   .subscribe((id) => {
    //     this.customerService.getCustomer(id)
    //       .subscribe((customer:Customer) => this.customer = customer)
    //   })

    let id = +this.route.snapshot.params['id'];
    this.customerService.getCustomer(id)
      .subscribe((customer:Customer) => this.customer = customer)
  }

  goBack() { this.router.navigate(['/dashboard/customers']); }

  // ngOnDestroy() {
  //   this.sub.unsubscribe()
  // }

}
