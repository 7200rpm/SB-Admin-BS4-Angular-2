import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {DeviceService} 			from '../device.service'
import { Device } from '../device';
import { Router, ActivatedRoute }       from '@angular/router';

import {TableTelemetryDemoComponent} from './telemetryTable.component';
import {TableDevicePowerComponent} from './powerTable.component';
import {TableDeviceScanComponent} from './scanTable.component';

import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';

import {VIS_DIRECTIVES} from './ng2-vis'

@Component({
  moduleId: module.id,
  selector: 'device-detail-cmp',
  templateUrl: 'device-detail.component.html',
  directives: [TableTelemetryDemoComponent, TableDevicePowerComponent,TableDeviceScanComponent, CHART_DIRECTIVES, VIS_DIRECTIVES]
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

  public selected_scan_event_index: number = 0;

  public max_events: number = 100;
  public loaded_events: number = 0;

  public time_data: any[];

  public chartLabels: number[];
	public chartData: number[];
	public chartType: string = 'line';

  public selected_event: any[];

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

    this.chartLabels = Array();
    for(var i = 0; i < 100; i++) {
      this.chartLabels.push(i);
    }
    
  }

  public LoadTimeline() {
    this.max_events = this.device.telemetry.length;
    this.loaded_events = 0;
    var temp_time_data = Array();
    for(var i = 0; i < this.device.telemetry.length; i++) {
      var element = this.device.telemetry[i];
      var data = {id:element.id,content:element.event,start:element.published_at}
      temp_time_data.push(data);
      this.loaded_events++;
    }
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
    if (this.device.power_events.length == this.selected_power_event_index - 1 || this.selected_power_event_index == null) {
      return;
    }
    this.selected_power_event_index++;
    this.selected_power_event = this.device.power_events[this.selected_power_event_index];
  }

  onPreviousPower() {
    if (this.selected_power_event_index == 0 || this.selected_power_event_index == null) {
      return;
    }
    this.selected_power_event_index--;
    this.selected_power_event = this.device.power_events[this.selected_power_event_index];
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
    // Find the selected event
    if(properties.x.items.length == 0) {
      this.selected_event = null;
      return;
    }
    for(var i = 0; i < this.device.telemetry.length; i++) {
      if(this.device.telemetry[i].id == properties.x.items[0]) {
        break;
      }
    }
    if(i < this.device.telemetry.length) {
      this.selected_event = this.device.telemetry[i];
    }
  }

  onScanSelect(scan: any) {
    this.chartData = scan.temperatures;
    this.selected_scan_event_index = this.FindScanIndex(scan.id);
  }

  onPreviousScan() {
    if(this.selected_scan_event_index > 0) {
      this.selected_scan_event_index--;
      this.chartData = this.device.scans[this.selected_scan_event_index].temperatures;
    }
  }

  onNextScan() {
    if(this.selected_scan_event_index < this.device.scans.length - 1) {
      this.selected_scan_event_index++;
      this.chartData = this.device.scans[this.selected_scan_event_index].temperatures;
    }
  }

  FindScanIndex(scan_id: string) {
    for(var i = 0; i < this.device.scans.length; i++) {
      if(this.device.scans[i].id == scan_id) {
        return i;
      }
    }
    return 0;
  }

}
