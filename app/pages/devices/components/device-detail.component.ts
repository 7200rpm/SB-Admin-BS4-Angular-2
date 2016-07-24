import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {DeviceService} 			from '../device.service'
import { Device } from '../device';
import { Router, ActivatedRoute }       from '@angular/router';

import {TableTelemetryDemoComponent} from './telemetryTable.component';
import {TableDevicePowerComponent} from './powerTable.component';

@Component({
  selector: 'device-detail-cmp',
  template: `
    <div class="container-fluid" *ngIf="device">
    <div class="row">
        <div class="col-xl-12">
            <h2 class="page-header"><button type="button" class="btn btn-primary" (click)="goBack()">Back</button> | <i class="fa fa-barcode"></i>                {{device.serial_number}}
            </h2>
            <hr />
        </div>
    </div>
    <div class="row">
        <div class="col-xl-4">
            <div *ngIf="submitted" class="card card-primary card-inverse">
                <div class="card-header card-primary">
                    <h3>Device</h3>
                </div>
                <div class="card-block bg-white">
                    <div class="table-responsive">
                        <table class="table">
                            <tbody>
                                <tr *ngIf="device.nickname">
                                    <th>Nickname</th>
                                    <td>{{device.nickname}}</td>
                                </tr>
                                <tr>
                                    <th>Serial Number</th>
                                    <td>{{device.serial_number}}</td>
                                </tr>
                                <tr>
                                    <th>Particle ID</th>
                                    <td>{{device.particleID}}</td>
                                </tr>
                                <tr>
                                    <th>Hardware Revision</th>
                                    <td>{{device.hardware_revision}}</td>
                                </tr>
                                <tr *ngIf="device.notes">
                                    <td colspan="2"><b>Notes:</b> {{device.notes}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <button class="btn btn-primary" (click)="submitted=false">Edit Information</button>
                    <hr />
                    <button *ngIf="!delete_warning" class="btn btn-danger" (click)="delete_warning=true">Delete Device</button>
                    <div *ngIf="delete_warning">
                        <div class="row">
                            <div class="col-xs-6">Are you sure you want to delete the device?</div>
                            <div class="col-xs-6 pull-right">
                                <button class="btn btn-danger" >Yes</button>
                                <button class="btn btn-warning" (click)="delete_warning=false">No</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div *ngIf="!submitted" class="card card-primary card-inverse">
                <div class="card-header card-primary">
                    <h3>Update</h3>
                </div>
                <div class="card-block bg-white">
                    <form role="form" (ngSubmit)="onSubmit()">
                        <fieldset class="form-group">
                            <label>Nickname</label>
                            <input class="form-control" name="device-nickname" value="{{device.nickname}}" [(ngModel)]="device.nickname">
                        </fieldset>
                        <fieldset class="form-group">
                            <label>Serial Number</label>
                            <input class="form-control" name="device-serial_number" value="{{device.serial_number}}" [(ngModel)]="device.serial_number">
                        </fieldset>
                        <fieldset class="form-group">
                            <label>Particle ID</label>
                            <input class="form-control" name="device-particleID" value="{{device.particleID}}" [(ngModel)]="device.particleID">
                        </fieldset>
                        <fieldset class="form-group">
                            <label>Hardware Revision</label>
                            <input class="form-control" name="device-hardware_revision" value="{{device.hardware_revision}}" [(ngModel)]="device.hardware_revision">
                        </fieldset>
                        <fieldset class="form-group">
                            <label>Notes</label>
                            <textarea class="form-control" name="device-notes" rows="3" value="{{device.notes}}" [(ngModel)]="device.notes"></textarea>
                        </fieldset>
                        <button type="submit" class="btn btn-primary">Save</button>
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
                            <div>
                                <h4>Shipped to<br />{{device.order.name}}</h4>
                            </div>
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
                            <div>
                                <h3>In Stock</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xl-8">
            <div class="card card-block">
            <h3>Telemetry</h3>
              <table-telemetry-demo [data_in]=device.events>
              </table-telemetry-demo>
          </div>
        </div>
    </div>
    <div class="row">
        <div class="col-xl-12">
            <div class="card card-block">
                <h3>Events</h3>
                <iframe src="http://wakeapi.azurewebsites.net/charts/events.php" style="border:none" width="100%" height="520"></iframe>
            </div>
            <div class="card card-block">
                <div class="row">
                    <div class="col-xl-6">
                        <h3>Power Events</h3>
                        <table-device-power [data_in]=device.power>
                        </table-device-power>
                    </div>
                    <div class="col-xl-6">
                        <div *ngIf="selected_power_event">
                            <h4>{{selected_power_event.type}}</h4>
                            {{selected_power_event.start_time}} - {{selected_power_event.end_time}}
                        </div>
                        <div *ngIf="!selected_power_event">
                            <h4>Select a power event</h4>
                        </div>
                        <iframe src="http://wakeapi.azurewebsites.net/charts/voltage.php" style="border:none" width="100%" height="800"></iframe>
                        <button type="button" class="btn btn-primary" (click)="onPreviousPower()">Previous</button>
                        <button type="button" class="btn btn-primary" (click)="onNextPower()">Next</button>
                        <a href="#" target="_blank" class="btn btn-warning">Export as PNG</a>
                    </div>
                </div>
            </div>
            <div class="card card-block">
                <h3>Scans</h3>
                <div class="row">
                    <div class="col-xl-6">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Timestamp</th>
                                        <th>Raw Peaks</th>
                                        <th>Filtered Peaks</th>
                                        <th>Selected Peak</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr *ngFor="let event of device.scans" (click)="onSelect(d)">
                                        <td>{{event.published_at}}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="col-xl-6">
                        <iframe src="http://wakeapi.azurewebsites.net/charts/scan.php" style="border:none" width="100%" height="520"></iframe>
                        <a href="#" target="_blank" class="btn btn-primary">Previous Scan</a>
                        <a href="#" target="_blank" class="btn btn-primary">Next Scan</a>
                        <a href="http://wakeapi.azurewebsites.net/charts/scan.php?print=true" target="_blank" class="btn btn-warning">Export as PNG</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `,
  directives: [TableTelemetryDemoComponent]
})

export class DeviceDetailComponent implements OnInit {
  @Input() device: Device;
  @Output() close = new EventEmitter();
  error: any;
  navigated = false; // true if navigated here

  private sub: any;

  public submitted=true; // False if user is updating information
  public delete_warning = false;

  public selected_power_event: any[];
  public selected_power_event_index: number;

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

  onPowerSelect(i: number,power_event: any[]) {
      this.selected_power_event = power_event;
      this.selected_power_event_index = i;
  }

  onNextPower() {
      if(this.device.power.length == this.selected_power_event_index - 1 ||  this.selected_power_event_index == null) {
          return;
      }
      this.selected_power_event_index++;
      this.selected_power_event = this.device.power[this.selected_power_event_index];
  }

  onPreviousPower() {
      if(this.selected_power_event_index == 0 ||  this.selected_power_event_index == null) {
          return;
      }
      this.selected_power_event_index--;
      this.selected_power_event = this.device.power[this.selected_power_event_index];
  }

  onSubmit() {this.submitted = true;}

  resizeIframe(obj: any) {
    obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
  }

  goBack() { this.router.navigate(['/dashboard/devices']); }

  // ngOnDestroy() {
  //   this.sub.unsubscribe()
  // }

}
