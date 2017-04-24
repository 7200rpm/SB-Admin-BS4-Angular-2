import { Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit, ViewContainerRef } from '@angular/core';
import {DeviceService} 			from '../device.service'
import { Device } from '../device';
import { Router, ActivatedRoute }       from '@angular/router';
import { AlertComponent, BUTTON_DIRECTIVES, DROPDOWN_DIRECTIVES, PAGINATION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {TableTelemetryDemoComponent} from './telemetryTable.component';
import {TableDevicePowerComponent} from './powerTable.component';
import {TableDeviceScanComponent} from './scanTable.component';

import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';

import {VIS_DIRECTIVES} from './ng2-vis'

import {GoogleChartComponent} from './ng2-google-charts'

import {DeviceDetail, PowerData, Wakeup} from '../device'

@Component({
  moduleId: module.id,
  selector: 'device-detail-cmp',
  templateUrl: 'device-detail.component.html',
  directives: [AlertComponent,BUTTON_DIRECTIVES, DROPDOWN_DIRECTIVES, PAGINATION_DIRECTIVES,TableTelemetryDemoComponent, GoogleChartComponent, TableDevicePowerComponent, TableDeviceScanComponent, CHART_DIRECTIVES, VIS_DIRECTIVES]
})

export class DeviceDetailComponent implements OnInit, AfterViewInit {
  error: any;
  navigated = false; // true if navigated here

    @ViewChild('scanChart', { read: GoogleChartComponent }) scanChart: GoogleChartComponent;
    @ViewChild('powerChart', { read: GoogleChartComponent }) powerChart: GoogleChartComponent;
    @ViewChild('scanContainer') scanContainer: any;
    @ViewChild('powerChartContainer') powerChartContainer: any;

  private sub: any;

  public submitted = true; // False if user is updating information
  public is_changed = false;
  public committing_changes = false;
  public delete_warning = false;
  public commit_success = false;

  public selected_power_event: PowerData;
  public selected_power_event_index: number;

  public selected_scan_event_index: number = 0;

  // Timeline variables
  public show_timeline: boolean = false; // True when timeline is to be shown
  public time_data: any[]; // Array of timeline data
  public selected_event: any[]; // Event the user selected
  private events_per_load: number = 100;
  private loaded_events: number;

  // Power plot variables
  public powerChartData: any[];
  public powerChartDataLength: number;
  public powerChartOptions = {
    title: '',
    subtitle: '',
    chartArea: {width: '80%'},
    width: 800,
    height: 640,
    legend: { position: 'bottom' },
    animation:{
        duration: 1000,
        easing: 'out',
      },
    hAxis: {
      title: 'Time'
    },
    vAxis: {
      title: 'Voltage',
      gridlines: {count: 11}
    }
    /*,
    trendlines: {
      0: {
        type: 'linear',
        color: 'green',
        lineWidth: 3,
        opacity: 0.3,
        showR2: true,
        visibleInLegend: true
      },
      1: {
        type: 'linear',
        color: 'yellow',
        lineWidth: 3,
        opacity: 0.3,
        showR2: true,
        visibleInLegend: true
      }
    }
    */
  };

  public device: DeviceDetail = new DeviceDetail();


  // Scan plot variables
  public scanImageUri: string;
  public scanValues: string;
  public chartLabels: number[];
  public chartData: any[];
  public chartOptions = {
    title: 'Temperature Graph',
    chartArea: {width: '80%'},
    width: 500,
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
      title: 'Temperature',
      minValue: 50,
      maxValue: 100
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
        let id = params['id'];
        this.navigated = true;
        this.deviceService.getDevice(id)
          .subscribe((device: DeviceDetail) => {
            this.device = device;
            if(this.device.wakeups.length > 0) {
              console.log("Building scan data...")
              var scan_data = this.buildScanData(this.device.wakeups[0]);
              this.chartData = scan_data;
              if(this.device.wakeups.length > 0) {
                this.selected_scan_event_index = this.device.wakeups.length - 1;
              }
              this.onScanSelect(this.device.wakeups[this.selected_scan_event_index]);
            } 
            if(this.device.powerData.length > 0) {
              this.powerChartData = this.buildPowerData(this.device.powerData[0]);
            }
          })
      }
      else {
        this.navigated = false;
        this.device = new DeviceDetail();
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
    this.chartOptions.width = this.scanContainer.nativeElement.clientWidth;
    this.powerChartOptions.width = this.powerChartContainer.nativeElement.clientWidth;
  }
/*
  public LoadTimeline() {
    if(!this.device.events) {
      return;
    }
    this.show_timeline = true
    var temp_time_data = Array(this.events_per_load);
    for (var i = 0; i < this.events_per_load; i++) {
      temp_time_data[i] = { id: this.device.events[i].id, content: this.device.events[i].event, start: this.device.events[i].published_at };
    }
    this.time_data = temp_time_data;
    this.loaded_events = this.events_per_load;
  }

  public loadMoreTimelineEvents() {
    var temp_time_data = Array(this.events_per_load);
    var i:number;
    for (var j = 0; j < this.events_per_load; j++) {
      i = this.loaded_events + j;
      temp_time_data[j] = { id: this.device.events[i].id, content: this.device.events[i].event, start: this.device.events[i].published_at };
    }
    this.time_data=  this.time_data.concat(temp_time_data);
    this.loaded_events += this.events_per_load;
  }
  */
/*
  public save() {
    this.committing_changes = true;
    if (this.device.coreID) {
      this.deviceService.updateDevice(this.device)
        .subscribe((device: Device) => {
          this.device = device;
          this.is_changed = false;
          this.committing_changes = false;
          this.commit_success = true;
        });

    }
    else {
      this.deviceService.addDevice(this.device)
        .subscribe((device: Device) => {
          this.device = device;
          this.is_changed = false;
          this.committing_changes = false;
          this.commit_success = true;
        });
    }
  }

  public delete() {
    this.deviceService.deleteDevice(this.device)
      .subscribe((device: Device) => {
        this.goBack();
      })
  }
*/
  buildPowerData(data: PowerData) {
    var data_out = new Array();
    data_out.push(new Array('Timestamp','Battery Voltage','Input Voltage'));
    for (var i = 0; i < data.count; i++) {
      var value = new Array<any>(new Date(data.voltage[i].timestamp), data.voltage[i].batteryVoltage, data.voltage[i].powerInVoltage);
      data_out.push(value);
    }
    return data_out;
  }

  onPowerSelect(power_event: PowerData) {
    this.powerChartData = this.buildPowerData(power_event);
    console.log(this.powerChartData);
    this.powerChartDataLength = this.powerChartData.length;
    this.powerChartOptions.title = power_event.type + " of " + this.device.serialNumber + " starting at " + (new Date(power_event.startTime)).toString();
  }

  viewPowerChart() {
    window.open(this.powerChart.imageURI);
  }
  /*
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
 */
  onSubmit() { 
    this.submitted = true; 
    this.is_changed = true;
  }

  resizeIframe(obj: any) {
    obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
  }

  goBack() { this.router.navigate(['/dashboard/devices']); }

  // ngOnDestroy() {
  //   this.sub.unsubscribe()
  // }
  /*
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
  */

  buildScanData(wakeup: Wakeup) {
    var data_out = new Array();
    data_out.push(new Array<Object>({label: "id"}, {label: "Temperature"}, {label: "Target", role: "annotation"}));
    if(wakeup.temperatures == null) {
      return null;
    }
    for (var i = 0; i < wakeup.temperatures.length; i++) {
      if(i == wakeup.target) {
        var value = new Array<Object>(i, 1.8*wakeup.temperatures[i]+32.0,"Target (" + wakeup.temperatures[i].toString() + ")");
      } else {
        var value = new Array<Object>(i, 1.8*wakeup.temperatures[i]+32.0,null);
      }
      //value.push({i, data[i]});
      data_out.push(value);
    }
    this.scanValues = wakeup.temperatures.join();
    this.chartOptions.title = "Temperature Plot for " + this.device.serialNumber + " on " + wakeup.localDate + " at " + wakeup.localTime + "L";
    return data_out;
  }

  onScanSelect(wakeup: Wakeup) {
    this.chartData = this.buildScanData(wakeup);
    this.selected_scan_event_index = this.FindScanIndex(wakeup.wakeupID);
  }

  onPreviousScan() {
    if (this.selected_scan_event_index > 0) {
      this.selected_scan_event_index--;
      this.chartData = this.buildScanData(this.device.wakeups[this.selected_scan_event_index]);
    }
  }

  onNextScan() {
    if (this.selected_scan_event_index < this.device.wakeups.length - 1) {
      this.selected_scan_event_index++;
      this.chartData = this.buildScanData(this.device.wakeups[this.selected_scan_event_index]);
    }
  }

  FindScanIndex(scan_id: number) {
    for (var i = 0; i < this.device.wakeups.length; i++) {
      if (this.device.wakeups[i].wakeupID == scan_id) {
        return i;
      }
    }
    return 0;
  }

  viewScanChart() {
    window.open(this.scanChart.imageURI);
  }
}
