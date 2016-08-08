import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ROUTER_DIRECTIVES } 	from '@angular/router';
import {TelemetryService} 			from '../telemetry.service';

import { Router }              from '@angular/router';
import { TableTelemetryComponent }              from './telemetryTable.component';

@Component({
  moduleId: module.id,
  selector: 'telemetry-cmp',
  templateUrl: 'telemetry.component.html',
  directives: [ROUTER_DIRECTIVES, TableTelemetryComponent]
})

export class TelemetryComponent implements OnInit {
  errorMessage: string
  events: any[]
  mode = 'Observable'

  constructor(
    private router: Router,
    private telemetryService: TelemetryService) { }

  ngOnInit() { this.getTelemetry() }

  getTelemetry() {
    this.telemetryService.getTelemetry()
      .subscribe(
      telemetry => this.events = telemetry,
      error => this.errorMessage = <any>error,
      () => console.log('Telemetry Loaded')
      )
  }

}
