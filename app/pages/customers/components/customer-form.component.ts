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

  onSubmit() { this.submitted = true; }



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
