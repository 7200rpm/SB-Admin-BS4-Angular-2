import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ROUTER_DIRECTIVES } 	from '@angular/router';
import {TelemetryService} 			from '../telemetry.service';

import { Router }              from '@angular/router';
import { TableTelemetryComponent }              from './telemetryTable.component';
import {GoogleChartComponent} from '../../devices/components/ng2-google-charts'

@Component({
  moduleId: module.id,
  selector: 'telemetry-cmp',
  templateUrl: 'telemetry.component.html',
  directives: [ROUTER_DIRECTIVES, TableTelemetryComponent,GoogleChartComponent]
})

export class TelemetryComponent implements OnInit {
  errorMessage: string
  telemetry: any;
  events: any[];
  mode = 'Observable'
  @ViewChild('eventStreamContainer') eventStreamContainer: any;

  public chartOptions = {
    title: 'Telemetry Stream',
    width: 800,
    height: 640,
    legend: { position: 'bottom' },
    animation:{
        duration: 1000,
        easing: 'out',
      },
    hAxis: {
      title: 'Local Time',
    },
    series: {
        0: {targetAxisIndex: 0},
        1: {targetAxisIndex: 1}
      },
      vAxes: {
        // Adds titles to each axis.
        0: {title: 'Total Events per Hour'},
        1: {title: 'Active Devices per Hour'}
      }
  };

  public chartData: any[];

  constructor(
    private router: Router,
    private telemetryService: TelemetryService) { }

  ngOnInit() { this.getTelemetry() }

  ngAfterViewInit() {
    this.chartOptions.width = this.eventStreamContainer.nativeElement.clientWidth;
  }

  getTelemetry() {
    this.telemetryService.getTelemetry()
      .subscribe(
      telemetry => this.telemetry = telemetry,
      error => this.errorMessage = <any>error,
      () => {
        this.events = this.telemetry.events;
        this.chartData = this.loadChartData();
      }
      )
  }

  loadChartData() {
    var data_out = new Array();
    data_out.push(new Array('Timestamp','Events','Devices'));
    /*
    for (var i = 0; i < this.telemetry.statistics.length; i++) {
      var value = new Array(new Date(this.telemetry.statistics[i].startTime), this.telemetry.statistics[i].telemetryCount, this.telemetry.statistics[i].deviceCount);
      data_out.push(value);
    }
    */
    return data_out;
  }
}
