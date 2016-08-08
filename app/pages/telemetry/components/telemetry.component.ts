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
  events: any[]
  mode = 'Observable'

  public chartOptions = {
    title: 'Telemetry Stream',
    width: '100%',
    height: 640,
    legend: { position: 'bottom' },
    animation:{
        duration: 1000,
        easing: 'out',
      },
    hAxis: {
      title: 'Time',
      minValue: 0
    },
    vAxis: {
      title: 'Events Per Hour'
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
      telemetry => this.events = telemetry,
      error => this.errorMessage = <any>error,
      () => {
        console.log('Telemetry Loaded')
        this.chartData = [
    ['Evolution', 'Imports', 'Exports'],
    ['A', 8695000, 6422800],
    ['B', 3792000, 3694000],
    ['C', 8175000, 800800]
    ];
      }
      )
  }

}
