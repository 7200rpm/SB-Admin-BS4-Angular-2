import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { LogService } from '../log.service';

import { Router } from '@angular/router';
import { TableAPILogComponent } from './logTable.component';

import { EventLog } from '../log'

@Component({
  moduleId: module.id,
  selector: 'log-cmp',
  templateUrl: 'log.component.html',
  directives: [ROUTER_DIRECTIVES, TableAPILogComponent]
})

export class LogComponent implements OnInit {
  log_events: EventLog[];
  selectedEvent: EventLog;
  mode = 'Observable'

  constructor(
    private router: Router,
    private logService: LogService) { }

  ngOnInit() { this.getLog() }

  getLog() {
    this.logService.getLog()
      .subscribe(log => this.log_events = log)
  }

  onEventSelect(event: EventLog) {
    console.log("Selected event");
    console.log(event);
    this.selectedEvent = event;
  }

  goToDevice() {
    if(this.selectedEvent.device != null) {
      this.router.navigate(['/dashboard/device', this.selectedEvent.device.coreID]);
    }
  }

  goToUser() {
    if(this.selectedEvent.user != null) {
      this.router.navigate(['/dashboard/customer', this.selectedEvent.user.userID]);
    }
  }
}
