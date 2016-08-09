import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
      title: 'Time',
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

  getTelemetry() {
    this.telemetryService.getTelemetry()
      .subscribe(
      telemetry => this.telemetry = telemetry,
      error => this.errorMessage = <any>error,
      () => {
        console.log('Telemetry Loaded');
        console.log(this.telemetry);
        this.events = this.telemetry.events;
        this.chartData = this.loadChartData();
      }
      )
  }

  loadChartData() {
    var data_out = new Array();
    data_out.push(new Array('Timestamp','Events','Devices'));
    for (var i = 0; i < this.telemetry.stream.length; i++) {
      var value = new Array(new Date(this.telemetry.stream[i].time), this.telemetry.stream[i].events, this.telemetry.stream[i].devices);
      data_out.push(value);
    }
    return data_out;
  }
}
