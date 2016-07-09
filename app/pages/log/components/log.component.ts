import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ROUTER_DIRECTIVES } 	from '@angular/router';
import {LogService} 			from '../log.service';

import { Router }              from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'log-cmp',
  templateUrl: 'log.component.html',
  directives: [ROUTER_DIRECTIVES]
})

export class LogComponent implements OnInit {
  errorMessage: string
  log_events: any[]
  mode = 'Observable'

  constructor(
    private router: Router,
    private logService: LogService) { }

  ngOnInit() { this.getLog() }

  getLog() {
    this.logService.getLog()
      .subscribe(
      log => this.log_events = log,
      error => this.errorMessage = <any>error,
      () => console.log('Log Loaded')
      )
  }

}
