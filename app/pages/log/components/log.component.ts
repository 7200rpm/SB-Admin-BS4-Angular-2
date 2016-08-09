import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ROUTER_DIRECTIVES } 	from '@angular/router';
import {LogService} 			from '../log.service';

import { Router }              from '@angular/router';
import {TableAPILogComponent} from './logTable.component';

@Component({
  moduleId: module.id,
  selector: 'log-cmp',
  templateUrl: 'log.component.html',
  directives: [ROUTER_DIRECTIVES, TableAPILogComponent]
})

export class LogComponent implements OnInit {
  errorMessage: string;
  log_events: any;
  APIrequests: any[];
  users: any;
  mode = 'Observable'

public error: any;

  constructor(
    private router: Router,
    private logService: LogService) { }

  ngOnInit() { this.getLog() }

  getLog() {
    this.logService.getLog()
      .subscribe(
      log => this.log_events = log,
      error => this.errorMessage = <any>error,
      () => {
        console.log('Log Loaded');
        this.APIrequests = this.log_events.requests;
        this.users = this.log_events.users;
      }
      )
  }

  onRequestSelect(request:any) {
    if(request.error != null) {
      this.error = request;
      this.error.error = JSON.parse(request.error).error;
    }
  }

}
