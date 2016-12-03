import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import { FORM_DIRECTIVES }    from '@angular/forms';
import { Customer }    from '../customer';
import {CustomerService} 			from '../customer.service';
import { Router, ActivatedRoute }       from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'customer-form',
  templateUrl: 'customer-form.component.html'
})
export class CustomerFormComponent implements OnInit {

  @Input() public customer: Customer;
  @Input() public customerService: CustomerService;
  @Input() public router: Router;

  public is_changed: boolean = false;
  public committing_changes: boolean = false;

  submitted = true;

  active = true;

  public ship_warning = false;
  public undo_ship_warning = false;

  public states: Array<string> = ['Alabama', 'Alaska', 'Arizona', 'Arkansas',
    'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
    'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico',
    'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island',
    'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'];

  ngOnInit() {
    // If a new customer, go to edit mode
    if (!this.customer.customerID) { this.submitted = false; }
  }

  onSubmit() { 
    this.submitted = true; 
    this.is_changed = true;
   }

  ShipOrder() {
    this.ship_warning = false;
    this.customer.order_status = 'Shipped';
  }

  UndoShip() {
    this.undo_ship_warning = false;
    this.customer.order_status = 'Unfulfilled';
  }

  public delete() {
    this.customerService.deleteCustomer(this.customer)
      .subscribe((customer: Customer) => {
        this.router.navigate(['/dashboard/customers']);
      })
  }

  // Reset the form with a new hero AND restore 'pristine' class state
  // by toggling 'active' flag which causes the form
  // to be removed/re-added in a tick via NgIf
  // TODO: Workaround until NgForm has a reset method (#6822)
  // active = true;
  // newHero() {
  //   this.model = new Hero(42, '', '');
  //   this.active = false;
  //   setTimeout(() => this.active = true, 0);
  // }
}
