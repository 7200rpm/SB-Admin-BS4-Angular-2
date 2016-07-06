import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {CustomerService} 			from '../customer.service'
import { Customer } from '../customer';
import { Router, ActivatedRoute }       from '@angular/router';
import { Observable }     from 'rxjs/Observable';

@Component({
  selector: 'customer-detail-cmp',
  template: `
    <!--
    <div class="container-fluid" *ngIf="customer">
      <div class="row">
        <h2>Device {{device.serial_number}}
          <button type="button" class="btn btn-lg btn-primary" (click)="goBack()">Back</button>
        </h2>
        <div class="col-xl-3">
          <h3>Update</h3>
          <form role="form">
            <fieldset class="form-group">
              <label>Serial Number</label>
              <input class="form-control" value="{{device.serial_number}}">
            </fieldset>
            <fieldset class="form-group">
              <label>Particle ID</label>
              <input class="form-control" value="{{device.particleID}}">
            </fieldset>
            <fieldset class="form-group">
              <label>Hardware Revision</label>
              <input class="form-control" value="{{device.hardware_revision}}">
            </fieldset>
            <fieldset class="form-group">
              <label>Notes</label>
              <textarea class="form-control" rows="3" value="{{device.notes}}"></textarea>
            </fieldset>
            <button type="submit" class="btn btn-secondary">Submit</button>
            <button type="reset" class="btn btn-secondary">Reset</button>
          </form>
        </div>
        <div class="col-xl-6">
          <h3>Telemetry</h3>
          <form role="form">
            <div class="form-group input-group">
              <input type="text" class="form-control" placeholder="Search measurands">
              <span class="input-group-btn"><button class="btn btn-secondary" type="button"><i class="fa fa-search"></i></button></span>
            </div>
          </form>
          <div class="card card-block">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Measurand</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- *ngFor="let t of devices.telemetry" -->
                  <tr>
                    <td>{{t.timestamp}}</td>
                    <td>{{t.measurand}}</td>
                    <td>{{t.value}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col-sm-3">
          <h3>Wakeups</h3>
            <ul class="list-group">
                <li class="list-group-item">Cras justo odio</li>
                <li class="list-group-item">Dapibus ac facilisis in</li>
                <li class="list-group-item">Morbi leo risus</li>
                <li class="list-group-item">Porta ac consectetur ac</li>
                <li class="list-group-item">Vestibulum at eros</li>
            </ul>
        </div>
      </div>
    </div>
    -->
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
    // let id = +this.route.snapshot.params['id'];
    // this.customerService.getCustomer(id).then((cus:Customer) => this.customer = cus);

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
