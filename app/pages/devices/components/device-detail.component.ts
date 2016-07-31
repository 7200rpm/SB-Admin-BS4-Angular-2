import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {DeviceService} 			from '../device.service'
import { Device } from '../device';
import { Router, ActivatedRoute }       from '@angular/router';

import {TableTelemetryDemoComponent} from './telemetryTable.component';
import {TableDevicePowerComponent} from './powerTable.component';

import {VIS_DIRECTIVES} from './ng2-vis'

@Component({
  moduleId: module.id,
  selector: 'device-detail-cmp',
  templateUrl: 'device-detail.component.html',
  directives: [TableTelemetryDemoComponent, TableDevicePowerComponent, VIS_DIRECTIVES]
})

export class DeviceDetailComponent implements OnInit {
  @Input() device: Device;
  @Output() close = new EventEmitter();
  error: any;
  navigated = false; // true if navigated here

  private sub: any;

  public submitted = true; // False if user is updating information
  public delete_warning = false;

  public selected_power_event: any[];
  public selected_power_event_index: number;

  public max_events: number = 100;
  public loaded_events: number = 0;

  public time_data: any[];

  constructor(
    private deviceService: DeviceService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        let id = +params['id'];
        this.navigated = true;
        this.deviceService.getDevice(id)
          .subscribe((device: Device) => this.device = device)
      }
      else {
        this.navigated = false;
        this.device = new Device();
      }
    })

    // Build the event data
    this.time_data = Array();
    
  }

  public LoadTimeline() {
    this.max_events = this.device.telemetry.length;
    this.loaded_events = 0;
    var temp_time_data = Array();
    this.device.telemetry.forEach(element => {
      var data = {id:element.id,content:element.event,start:element.published_at}
      temp_time_data.push(data);
      this.loaded_events++;
    });
    this.time_data = temp_time_data;
  }

  public save() {
    if (this.device.deviceID) {
      this.deviceService.updateDevice(this.device)
        .subscribe((device: Device) => {
          this.device = device;
          this.goBack();
        });

    }
    else {
      this.deviceService.addDevice(this.device)
        .subscribe((device: Device) => {
          this.device = device;
          this.goBack();
        });
    }
  }

  public delete(){
    this.deviceService.deleteDevice(this.device)
    .subscribe((device: Device) => {
      this.goBack();
    })
  }

  onPowerSelect(i: number, power_event: any[]) {
    this.selected_power_event = power_event;
    this.selected_power_event_index = i;
  }

  onNextPower() {
    if (this.device.power.length == this.selected_power_event_index - 1 || this.selected_power_event_index == null) {
      return;
    }
    this.selected_power_event_index++;
    this.selected_power_event = this.device.power[this.selected_power_event_index];
  }

  onPreviousPower() {
    if (this.selected_power_event_index == 0 || this.selected_power_event_index == null) {
      return;
    }
    this.selected_power_event_index--;
    this.selected_power_event = this.device.power[this.selected_power_event_index];
  }

  onSubmit() { this.submitted = true; }

  resizeIframe(obj: any) {
    obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
  }

  goBack() { this.router.navigate(['/dashboard/devices']); }

  // ngOnDestroy() {
  //   this.sub.unsubscribe()
  // }

  onVisSelect(properties: any) {
    //alert('selected items: ' + properties.x.items);
  }

}
