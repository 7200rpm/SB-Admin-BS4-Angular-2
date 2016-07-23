import {Component, EventEmitter, Input, Output} from '@angular/core';
import { FORM_DIRECTIVES }    from '@angular/forms';
import { Customer }    from '../customer';

@Component({
  moduleId: module.id,
  selector: 'customer-form',
  templateUrl: 'customer-form.component.html'
})
export class CustomerFormComponent {

  @Input() public customer: Customer;

  submitted = true;

  active = true;

  ship_warning = false;

  public states:Array<string> = ['Alabama', 'Alaska', 'Arizona', 'Arkansas',
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

  onSubmit() { this.submitted = true; }

  ship_order() { 
    this.ship_warning = false;
    this.customer.status = 'Shipped'; 
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
