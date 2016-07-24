import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {DeviceService} 			from '../device.service'
import { Device } from '../device';
import { Router, ActivatedRoute }       from '@angular/router';

import {TableTelemetryDemoComponent} from './telemetryTable.component';
import {TableDevicePowerComponent} from './powerTable.component';

@Component({
    moduleId: module.id,
  selector: 'device-detail-cmp',
  templateUrl: 'device-detail.component.html',
  directives: [TableTelemetryDemoComponent, TableDevicePowerComponent]
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
