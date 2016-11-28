import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ROUTER_DIRECTIVES } 	from '@angular/router';
import {DeviceService} 			from '../device.service'
import {Device} 						from '../device'
import { Router }              from '@angular/router';
import {TableDeviceDemoComponent} from './deviceTable.component'

import {VIS_DIRECTIVES} from './ng2-vis'

import {GoogleChartComponent} from './ng2-google-charts'

@Component({
  moduleId: module.id,
  selector: 'device-cmp',
  templateUrl: 'devices.component.html',
  directives: [ROUTER_DIRECTIVES, TableDeviceDemoComponent, VIS_DIRECTIVES, GoogleChartComponent]
})

export class DeviceComponent implements OnInit {
  errorMessage: string
  devices: Device[]
  mode = 'Observable'
  time_data: Array<any>

  constructor(
    private router: Router,
    private deviceService: DeviceService) { }

  ngOnInit() {

    this.getDevices();

    this.time_data =
      [
        { id: 1, content: 'item 1', start: '2013-04-20' },
        { id: 2, content: 'item 2', start: '2013-04-14' },
        { id: 3, content: 'item 3', start: '2013-04-18' },
        { id: 4, content: 'item 4', start: '2013-04-16', end: '2013-04-19' },
        { id: 5, content: 'item 5', start: '2013-04-25' },
        { id: 6, content: 'item 6', start: '2013-04-27' }]

  }

  getDevices() {
    this.deviceService.getDevices()
      .subscribe(
      devices => { this.devices = devices },
      error => { this.errorMessage = <any>error; console.log("Error: " + error) },
      () => console.log('Devices Completed!')
      )
  }

  onSelect(device: Device) {
    this.router.navigate(['/dashboard/device', device.coreID]);
  }

  onVisSelect(properties: any) {
    //alert('selected items: ' + properties.x.items);
  }
}
