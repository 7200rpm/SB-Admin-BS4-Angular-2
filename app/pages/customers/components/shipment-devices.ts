import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'shipment-devices',
  template: `<fieldset class="form-group">
                  <select multiple="" size="8" class="form-control" name="shipment_devices" (change)="setSelectedDevices($event.target.options)">
                      <option *ngFor="let shipment_device of shipment_devices" [value]="shipment_device.deviceID">
                        {{shipment_device.serial_number}}
                      </option>
                  </select>
              </fieldset>
      `
})
export class ShipmentDevicesComponent implements OnInit {

  @Input() public shipment_devices: any;

  public selected_devices: any;
  
  ngOnInit() {

  }

  setSelectedDevices(selectElement: any[]) {
    this.selected_devices = Array();
    for(var i = 0; i < selectElement.length; i++) {
      if(selectElement[i].selected) {
        this.selected_devices.push({deviceID: selectElement[i].value, serial_number: selectElement[i].text});
      }
    }
    console.log(this.selected_devices);
  }

}
