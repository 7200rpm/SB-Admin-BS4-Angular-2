import {Component, EventEmitter, ViewChild, Input, OnInit, Output, AfterViewInit} from '@angular/core';
import {CustomerService} 			from '../customer.service'
import { Customer } from '../customer';
import { Router, ActivatedRoute }       from '@angular/router';
import { Observable }     from 'rxjs/Observable';
import {AlertComponent} from 'ng2-bootstrap/ng2-bootstrap';

import {CustomerFormComponent} from './customer-form.component';

import { AvailableDevicesComponent } from './available-devices';
import { ShipmentDevicesComponent } from './shipment-devices';

@Component({
  moduleId: module.id,
  selector: 'customer-detail-cmp',
  templateUrl: 'customer-detail.component.html',
  directives:[AlertComponent, CustomerFormComponent, AvailableDevicesComponent, ShipmentDevicesComponent]
})

export class CustomerDetailComponent implements OnInit {
  @Input() customer: Customer;
  @Output() close = new EventEmitter();

  @ViewChild('availabledevices') available_devices_component: any;
  @ViewChild('shipmentdevices') shipment_devices_component: any;

  error: any;
  navigated = false; // true if navigated here

  public order_units: Array<any>;

  public added_unit:string = "";

  private sub: any;
  
  public delete_warning = false;

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      if(params['id'] !== undefined){
        let id = +params['id'];
        this.navigated = true;
        this.customerService.getCustomer(id)
          .subscribe((customer:Customer) => {
            this.customer = customer;
            if(this.customer.order_date) {
              this.customer.order_date = new Date(this.customer.order_date).toDateString();
            }
            this.order_units = new Array();
          })
      }
      else{
        this.navigated = false;
        this.customer = new Customer();
      }
    })
  }

  public save(){
    if(this.customer.customerID){
      this.customerService.updateCustomer(this.customer)
      .subscribe((customer:Customer) => {
        this.customer = customer;
        this.goBack();
      });

    }
    else{
      this.customerService.addCustomer(this.customer)
      .subscribe((customer:Customer) => {
        this.customer = customer;
        this.goBack();
      });
    }
  }

  addDevices() {
    // Add the devices to the order
    if(this.customer.devices.length == 0) {
      this.customer.devices = this.available_devices_component.selected_devices;
    } else {
      for(var i = 0; i < this.available_devices_component.selected_devices.length; i++) {
        this.customer.devices.push(this.available_devices_component.selected_devices[i]);
      }
    }
    // Splice out the selected devices
    for(var i = 0; i < this.available_devices_component.selected_devices.length; i++) {
      for(var j = 0; j < this.customer.available_devices.length; j++) {
        if(this.available_devices_component.selected_devices[i].deviceID == this.customer.available_devices[j].deviceID) {
          this.customer.available_devices.splice(j,1);
        }
      }
    }
  }

  removeDevices() {
    console.log(this.shipment_devices_component.selected_devices);
    // Add the devices back to the available list
    if(this.customer.available_devices.length == 0) {
      this.customer.available_devices = this.shipment_devices_component.selected_devices;
    } else {
      for(var i = 0; i < this.shipment_devices_component.selected_devices.length; i++) {
        this.customer.available_devices.push(this.shipment_devices_component.selected_devices[i]);
      }
    }
    // Splice out the selected devices
    for(var i = 0; i < this.shipment_devices_component.selected_devices.length; i++) {
      for(var j = 0; j < this.customer.devices.length; j++) {
        if(this.shipment_devices_component.selected_devices[i].deviceID == this.customer.devices[j].deviceID) {
          this.customer.devices.splice(j,1);
        }
      }
    }
  }

  goBack() { this.router.navigate(['/dashboard/customers']); }

  // ngOnDestroy() {
  //   this.sub.unsubscribe()
  // }

}
