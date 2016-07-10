import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgIf} from '@angular/common';
import {PAGINATION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {NG_TABLE_DIRECTIVES} from '../../../components/ng2-table';

import {DeviceService} 			from '../device.service'
import {Device} 						from '../device'

// webpack html imports
//let template = require('./table-demo.html');

@Component({
  selector: 'table-device-demo',
  template: `

  <input *ngIf="configEmail.filtering" placeholder="Serial Number"
         [ngTableFiltering]="configEmail.filtering"
         (tableChanged)="onChangeTable(configEmail)"/>

  <input *ngIf="configFirstName.filtering" placeholder="Particle ID"
         [ngTableFiltering]="configFirstName.filtering"
         (tableChanged)="onChangeTable(configFirstName)"/>

  <input *ngIf="configLastName.filtering" placeholder="Hardware Revision"
       [ngTableFiltering]="configLastName.filtering"
       (tableChanged)="onChangeTable(configLastName)"/>



  <ng-device-table [config]="config.sorting"
             (tableChanged)="onChangeTable(config)"
             (rowClicked)="onRowClicked($event)"
             [rows]="rows" [columns]="columns">
  </ng-device-table>
  <pagination *ngIf="config.paging"
              class="pagination-sm"
              [(ngModel)]="page"
              [totalItems]="length"
              [itemsPerPage]="itemsPerPage"
              [maxSize]="maxSize"
              [boundaryLinks]="true"
              [rotate]="false"
              (pageChanged)="onChangeTable(config, $event)"
              (numPages)="numPages = $event">
  </pagination>
  <pre *ngIf="config.paging" class="card card-block card-header">Page: {{page}} / {{numPages}} </pre>
  `,
  directives: [NG_TABLE_DIRECTIVES, PAGINATION_DIRECTIVES, NgClass, NgIf, CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class TableDeviceDemoComponent implements OnInit {

  @Output() public rowClicked:EventEmitter<any> = new EventEmitter();

  public rows: Array<any> = [];
  public columns: Array<any> = [
    { title: 'Device ID', name: 'deviceID' },
    { title: 'Serial Number', name: 'serial_number' },
    { title: 'Particle ID', name: 'particleID' },
    { title: 'Hardware Revision', name: 'hardware_revision' },
    { title: 'Status', name: 'status' }
  ];
  public page: number = 1;
  public itemsPerPage: number = 10;
  public maxSize: number = 5;
  public numPages: number = 1;
  public length: number = 0;

  public config: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '', columnName: 'serial_number' }
  };


  public configEmail: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '', columnName: 'serial_number' }
  };

  public configFirstName: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '', columnName: 'particleID' }
  };

  public configLastName: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '', columnName: 'hardware_revision' }
  };



  errorMessage: string
  devices: Device[]
  mode = 'Observable'

  private data: Array<any>;// = TableData;

  public constructor(
    private deviceService: DeviceService) { }

  public ngOnInit(): void {
    this.getDevices();


  }

  getDevices() {
    this.deviceService.getDevices()
      .subscribe(
      devices => {this.data = devices; this.length = this.data.length; this.onChangeTable(this.config);},
      error => this.errorMessage = <any>error,
      () => console.log('Devices Completed!')
      )
  }

  // onSelect(customer: Customer) {
  //   this.router.navigate(['/dashboard/customer', customer.customerID]);
  // }

  public onRowClicked(row: any): void {
    this.rowClicked.emit(row);
  }

  public changePage(page: any, data: Array<any> = this.data): Array<any> {
    console.log(page);
    let start = (page.page - 1) * page.itemsPerPage;
    let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
    return data.slice(start, end);
  }

  public changeSort(data: any, config: any): any {
    if (!config.sorting) {
      return data;
    }

    let columns = this.config.sorting.columns || [];
    let columnName: string = void 0;
    let sort: string = void 0;

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].sort !== '') {
        columnName = columns[i].name;
        sort = columns[i].sort;
      }
    }

    if (!columnName) {
      return data;
    }

    // simple sorting
    return data.sort((previous: any, current: any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  public changeFilter(data: any, config: any): any {
    if (!config.filtering) {
      return data;
    }

    let filteredData: Array<any> = data.filter((item: any) =>
      item[config.filtering.columnName].toLowerCase().match(this.config.filtering.filterString.toLowerCase()));

    return filteredData;
  }

  public onChangeTable(config: any, page: any = { page: this.page, itemsPerPage: this.itemsPerPage }): any {
    if (config.filtering) {
      Object.assign(this.config.filtering, config.filtering);
    }
    if (config.sorting) {
      Object.assign(this.config.sorting, config.sorting);
    }

    let filteredData = this.changeFilter(this.data, this.config);
    let sortedData = this.changeSort(filteredData, this.config);
    this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
    this.length = sortedData.length;
  }
}
