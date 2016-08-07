import { Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit, ViewContainerRef } from '@angular/core';
import {DeviceService} 			from '../device.service'
import { Device } from '../device';
import { Router, ActivatedRoute }       from '@angular/router';

import {TableTelemetryDemoComponent} from './telemetryTable.component';
import {TableDevicePowerComponent} from './powerTable.component';
import {TableDeviceScanComponent} from './scanTable.component';

import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';

import {VIS_DIRECTIVES} from './ng2-vis'

import {GoogleChartComponent} from './ng2-google-charts'

@Component({
  moduleId: module.id,
  selector: 'device-detail-cmp',
  templateUrl: 'device-detail.component.html',
  directives: [TableTelemetryDemoComponent, GoogleChartComponent, TableDevicePowerComponent, TableDeviceScanComponent, CHART_DIRECTIVES, VIS_DIRECTIVES]
})

export class DeviceDetailComponent implements OnInit, AfterViewInit {
  error: any;
  navigated = false; // true if navigated here

    @ViewChild('yourchart', { read: GoogleChartComponent }) gchart: GoogleChartComponent;

  private sub: any;

  public submitted = true; // False if user is updating information
  public delete_warning = false;

  public selected_power_event: any[];
  public selected_power_event_index: number;

  public selected_scan_event_index: number = 0;

  // Timeline variables
  public show_timeline: boolean = false; // True when timeline is to be shown
  public loading_timeline: boolean = false; // True when the timeline is loading
  public time_data: any[]; // Array of timeline data
  public selected_event: any[]; // Event the user selected

  public device: Device = new Device()


  // Scan plot variables
  public scanImageUri: string;

  public chartLabels: number[];
  public chartData: any[];
  public chartOptions = {
    title: 'Temperature Graph',
    width: '100%',
    height: 640,
    legend: { position: 'bottom' },
    animation:{
        duration: 1000,
        easing: 'out',
      },
    hAxis: {
      title: 'Sweep',
      minValue: 0
    },
    vAxis: {
      title: 'Temperature'
    }
  };

  constructor(
    private deviceService: DeviceService,
    private route: ActivatedRoute,
    private router: Router
  ) {  }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        let id = +params['id'];
        this.navigated = true;
        this.deviceService.getDevice(id)
          .subscribe((device: Device) => {
            this.device = device;
            var scan_data = this.buildScanData(this.device.scans[0].temperatures);
            this.chartData = scan_data;
            // this.LoadTimeline();

          })
      }
      else {
        this.navigated = false;
        this.device = new Device();
        this.submitted = false;
      }
    })

    // Build the event data
    this.time_data = Array();

    this.chartLabels = Array();
    for (var i = 0; i < 100; i++) {
      this.chartLabels.push(i);
    }


  }

  ngAfterViewInit() {

    //console.log(this.gchart.chartType)


  }

  public LoadTimeline() {
    this.show_timeline = true
    this.loading_timeline = true;
    var temp_time_data = Array(this.device.telemetry.length);
    for (var i = 0; i < this.device.telemetry.length; i++) {
      temp_time_data[i] = { id: this.device.telemetry[i].id, content: this.device.telemetry[i].event, start: this.device.telemetry[i].published_at };
    }
    this.time_data = temp_time_data;
    this.loading_timeline = false;
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

  public delete() {
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
    if (properties.x.items.length == 0) {
      this.selected_event = null;
      return;
    }
    for (var i = 0; i < this.device.telemetry.length; i++) {
      if (this.device.telemetry[i].id == properties.x.items[0]) {
        break;
      }
    }
    if (i < this.device.telemetry.length) {
      this.selected_event = this.device.telemetry[i];
    }
  }

  buildScanData(data: number[]) {
    var data_out = new Array();
    data_out.push(new Array('id', 'Temperature'));
    for (var i = 0; i < data.length; i++) {
      var value = new Array(i, data[i]);
      //value.push({i, data[i]});
      data_out.push(value);
    }
    return data_out;
  }

  onScanSelect(scan: any) {
    this.chartData = this.buildScanData(scan.temperatures);
    this.selected_scan_event_index = this.FindScanIndex(scan.id);
  }

  onPreviousScan() {
    if (this.selected_scan_event_index > 0) {
      this.selected_scan_event_index--;
      this.chartData = this.buildScanData(this.device.scans[this.selected_scan_event_index].temperatures);
    }
  }

  onNextScan() {
    if (this.selected_scan_event_index < this.device.scans.length - 1) {
      this.selected_scan_event_index++;
      this.chartData = this.buildScanData(this.device.scans[this.selected_scan_event_index].temperatures);
    }
  }

  FindScanIndex(scan_id: string) {
    for (var i = 0; i < this.device.scans.length; i++) {
      if (this.device.scans[i].id == scan_id) {
        return i;
      }
    }
    return 0;
  }

}
