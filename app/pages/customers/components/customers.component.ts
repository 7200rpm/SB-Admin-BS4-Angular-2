import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ROUTER_DIRECTIVES } 	from '@angular/router';
import {CustomerService} 			from '../customer.service'
import {Customer} 						from '../customer'
import { Router }              from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'customer-cmp',
  templateUrl: 'customers.component.html',
  directives: [ROUTER_DIRECTIVES]
})

export class CustomerComponent implements OnInit {
  errorMessage: string
  customers: Customer[]
  mode = 'Observable'

  constructor(
    private router: Router,
    private customerService: CustomerService) { }

  ngOnInit() { this.getCustomers() }

  getCustomers() {
    this.customerService.getCustomers()
      .subscribe(
      customers => this.customers = customers,
      error => this.errorMessage = <any>error,
      () => console.log('Customers Completed!')
      )
  }

  onSelect(customer: Customer) {
    this.router.navigate(['/dashboard/customer', customer.customerID]);
  }
}
