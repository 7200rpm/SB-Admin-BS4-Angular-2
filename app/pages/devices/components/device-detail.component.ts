import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {DeviceService} 			from '../device.service'
import { Device } from '../device';
import { Router, ActivatedRoute }       from '@angular/router';

@Component({
  selector: 'device-detail-cmp',
  template: `
    <div *ngIf="device">
      <h2>{{device.first_name}} {{device.last_name}}</h2>
      <div><label>id: </label>{{device.customerID}}</div>
      <div>
        <label>name: </label>
        <input [(ngModel)]="device.first_name" placeholder="name"/>
      </div>
    </div>
    <p>
      <button (click)="goBack()">Back</button>
    </p>
  `
})

export class DeviceDetailComponent implements OnInit {
  @Input() device: Device;
  @Output() close = new EventEmitter();
  error: any;
  navigated = false; // true if navigated here

  private sub: any;

  constructor(
    private deviceService: DeviceService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // this.sub = this.route.params.subscribe(params => {
    //   let id = +params['id']; // (+) converts string 'id' to a number
    //   this.customerService.getCustomer(id).then(customer => this.customer = customer);
    // });

    // (+) converts string 'id' to a number
    let id = +this.route.snapshot.params['id'];
    this.deviceService.getDevice(id)
      .subscribe((device:Device) => this.device = device)
  }

  goBack() { this.router.navigate(['/dashboard/devices']); }

  // ngOnDestroy() {
  //   this.sub.unsubscribe()
  // }

}
