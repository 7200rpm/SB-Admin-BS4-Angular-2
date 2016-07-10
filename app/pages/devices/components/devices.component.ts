import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ROUTER_DIRECTIVES } 	from '@angular/router';
import {DeviceService} 			from '../device.service'
import {Device} 						from '../device'
import { Router }              from '@angular/router';
import {TableDeviceDemoComponent} from './deviceTable.component'

@Component({
  moduleId: module.id,
  selector: 'device-cmp',
  templateUrl: 'devices.component.html',
  directives: [ROUTER_DIRECTIVES, TableDeviceDemoComponent]
})

export class DeviceComponent implements OnInit {
  errorMessage: string
  devices: Device[]
  mode = 'Observable'

  constructor(
    private router: Router,
    private deviceService: DeviceService) { }

  ngOnInit() {  }

  // getDevices() {
  //   this.deviceService.getDevices()
  //     .subscribe(
  //     devices => this.devices = devices,
  //     error => this.errorMessage = <any>error,
  //     () => console.log('Devices Completed!')
  //   )
  // }

  onSelect(device: Device) {
    this.router.navigate(['/dashboard/device', device.deviceID]);
  }
}
