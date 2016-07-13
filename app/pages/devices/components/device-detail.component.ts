import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {DeviceService} 			from '../device.service'
import { Device } from '../device';
import { Router, ActivatedRoute }       from '@angular/router';

@Component({
  selector: 'device-detail-cmp',
  template: `
    <div class="container-fluid" *ngIf="device">
        <div class="row">
        <div class="col-xl-12">
        <h2 class="page-header"><button type="button" class="btn btn-primary" (click)="goBack()">Back</button> | <i class="fa fa-barcode"></i> {{device.serial_number}}
        </h2>
        <hr />
        </div>
    </div>
      <div class="row">
        <div class="col-xl-3">
          <div class="card card-primary card-inverse">
            <div class="card-header card-primary">
              <h3>Update</h3>
            </div>
            <div class="card-block bg-white">

          <form role="form">
            <fieldset class="form-group">
              <label>Nickname</label>
              <input class="form-control" value="{{device.nickname}}" [(ngModel)]="device.nickname">
            </fieldset>
            <fieldset class="form-group">
              <label>Serial Number</label>
              <input class="form-control" value="{{device.serial_number}}" [(ngModel)]="device.serial_number">
            </fieldset>
            <fieldset class="form-group">
              <label>Particle ID</label>
              <input class="form-control" value="{{device.particleID}}" [(ngModel)]="device.particleID">
            </fieldset>
            <fieldset class="form-group">
              <label>Hardware Revision</label>
              <input class="form-control" value="{{device.hardware_revision}}" [(ngModel)]="device.hardware_revision">
            </fieldset>
            <fieldset class="form-group">
              <label>Notes</label>
              <textarea class="form-control" rows="3" value="{{device.notes}}" [(ngModel)]="device.notes"></textarea>
            </fieldset>
            <button type="submit" class="btn btn-secondary">Submit</button>
            <button type="reset" class="btn btn-secondary">Reset</button>
          </form>
        </div>
        </div>
          <div *ngIf=device.orderID class="card card-success card-inverse">
                <div class="card-header card-success">
                    <div class="row">
                        <div class="col-xs-3">
                            <i class="fa fa-user fa-5x"></i>
                        </div>
                        <div class="col-xs-9 text-xs-right">
                            <div><h4>Shipped to<br />{{device.order.name}}</h4></div>
                        </div>
                    </div>
                </div>
                <div class="card-footer card-green">
                    <a class="text-success" href="dashboard/customer/{{device.orderID}}">
                        <span class="pull-xs-left">View Details</span>
                        <span class="pull-xs-right"><i class="fa fa-arrow-circle-right"></i></span>
                        <div class="clearfix"></div>
                    </a>
                </div>
            </div>
            <div *ngIf=!device.order class="card card-warning card-inverse">
                <div class="card-header card-warning">
                    <div class="row">
                        <div class="col-xs-3">
                            <i class="fa fa-home fa-5x"></i>
                        </div>
                        <div class="col-xs-9 text-xs-right">
                            <div><h3>In Stock</h3></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xl-9">
          <div class="card card-block">
            <h3>Events</h3>
            <iframe src="http://wakeapi.azurewebsites.net/charts/events.php" style="border:none" width="100%" height="520"></iframe>
          </div>
          <div class="card card-block">
            <h3>Voltage</h3>
            <iframe src="http://wakeapi.azurewebsites.net/charts/voltage.php" style="border:none" width="100%" height="510"></iframe>
          </div>
          <div class="card card-block">
          <h3>Telemetry</h3>
          <form role="form">
            <div class="form-group input-group">
              <input type="text" class="form-control" placeholder="Search measurands">
              <span class="input-group-btn"><button class="btn btn-secondary" type="button"><i class="fa fa-search"></i></button></span>
            </div>
          </form>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Event</th>
                    <th>Measurement</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let event of device.events" (click)="onSelect(d)">
                    <td>{{event.published_at}}</td>
                    <td>{{event.name}}</td>
                    <td>{{event.measurand}}</td>
                    <td>{{event.value}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})

export class DeviceDetailComponent implements OnInit {
  @Input() device: Device;
  @Output() close = new EventEmitter();
  error: any;
  navigated = false; // true if navigated here

  private sub: any;

  constructor(
    private deviceService: DeviceService,
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
    this.deviceService.getDevice(id)
      .subscribe((device: Device) => this.device = device)
  }

  goBack() { this.router.navigate(['/dashboard/devices']); }

  // ngOnDestroy() {
  //   this.sub.unsubscribe()
  // }

}
