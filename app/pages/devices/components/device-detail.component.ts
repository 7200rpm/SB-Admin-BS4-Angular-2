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

  public selected_power_event: any[];
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
    legend: { position: 'right' },
    animation:{
        duration: 1000,
        easing: 'out',
      },
    hAxis: {
      title: 'Time'
    },
    vAxis: {
      title: 'Voltage'
    },
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
  };

  public device: Device = new Device()


  // Scan plot variables
  public scanImageUri: string;

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
          .subscribe((device: Device) => {
            this.device = device;
            /*
            if(this.device.scans.length > 0) {
              var scan_data = this.buildScanData(this.device.scans[0].temperatures,this.device.scans[0].started_at,this.device.scans[0].target);
              this.chartData = scan_data;
            }
            if(this.device.power_events.length > 0) {
              this.powerChartData = this.buildPowerData(this.device.power_events[0].voltage);
            }
            */
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
    this.chartOptions.width = this.scanContainer.nativeElement.clientWidth;
    this.powerChartOptions.width = this.powerChartContainer.nativeElement.clientWidth;
  }

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

  buildPowerData(data: any[]) {
    var data_out = new Array();
    data_out.push(new Array('Timestamp','Battery Voltage','Input Voltage'));
    for (var i = 0; i < data.length; i++) {
      var value = new Array(new Date(data[i].timestamp), data[i].b, data[i].p);
      //value.push({i, data[i]});
      data_out.push(value);
    }
    return data_out;
  }

  onPowerSelect(power_event: any) {
    this.powerChartData = this.buildPowerData(power_event.voltage);
    this.powerChartDataLength = this.powerChartData.length;
    this.powerChartOptions.title = power_event.event_type + " of " + this.device.serialNumber + " for " + (new Date(power_event.start_time)).toString();
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

  buildScanData(data: number[],scan_date: string,target: number) {
    var data_out = new Array();
    data_out.push(new Array<Object>({label: "id"}, {label: "Temperature"}, {label: "Target", role: "annotation"}));
    for (var i = 0; i < data.length; i++) {
      if(i == target) {
        var value = new Array<Object>(i, 1.8*data[i]+32.0,"Target (" + target.toString() + ")");
      } else {
        var value = new Array<Object>(i, 1.8*data[i]+32.0,null);
      }
      
      //value.push({i, data[i]});
      data_out.push(value);
    }
    this.chartOptions.title = "Temperature Plot for " + this.device.serial_number + " on " + (new Date(scan_date)).toString();
    return data_out;
  }

  onScanSelect(scan: any) {
    this.chartData = this.buildScanData(scan.temperatures,scan.started_at,scan.target);
    this.selected_scan_event_index = this.FindScanIndex(scan.id);
  }

  onPreviousScan() {
    if (this.selected_scan_event_index > 0) {
      this.selected_scan_event_index--;
      this.chartData = this.buildScanData(this.device.scans[this.selected_scan_event_index].temperatures,this.device.scans[this.selected_scan_event_index].started_at,this.device.scans[this.selected_scan_event_index].target);
    }
  }

  onNextScan() {
    if (this.selected_scan_event_index < this.device.scans.length - 1) {
      this.selected_scan_event_index++;
      this.chartData = this.buildScanData(this.device.scans[this.selected_scan_event_index].temperatures,this.device.scans[this.selected_scan_event_index].started_at,this.device.scans[this.selected_scan_event_index].target);
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

  viewScanChart() {
    window.open(this.scanChart.imageURI);
  }
*/
}
