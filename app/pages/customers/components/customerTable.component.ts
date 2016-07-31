import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {CORE_DIRECTIVES, NgClass, NgIf} from '@angular/common';
import {PAGINATION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {NG_TABLE_DIRECTIVES} from '../../../components/ng2-table';

import { FORM_DIRECTIVES }    from '@angular/forms';

import {CustomerService} 			from '../customer.service'
import {Customer} 						from '../customer'

// webpack html imports
//let template = require('./table-demo.html');

@Component({
  selector: 'table-customer-demo',
  template: `

  <div class="row">
    <div class="col-xl-3">
      <fieldset class="form-group">
        <input *ngIf="configNickname.filtering" placeholder="Order Nickname"
          class="form-control"
           [ngTableFiltering]="configNickname.filtering"
           (tableChanged)="onChangeTable(configNickname)"/>
      </fieldset>
    </div>
    <div class="col-xl-3">
      <fieldset class="form-group">
        <input *ngIf="configName.filtering" placeholder="Customer Name"
          class="form-control"
           [ngTableFiltering]="configName.filtering"
           (tableChanged)="onChangeTable(configName)"/>
      </fieldset>
    </div>
    <div class="col-xl-3">
      <fieldset class="form-group">
        <input *ngIf="configEmail.filtering" placeholder="Customer Email"
          class="form-control"
           [ngTableFiltering]="configEmail.filtering"
           (tableChanged)="onChangeTable(configEmail)"/>
      </fieldset>
    </div>
    <div class="col-xl-3">
      <fieldset class="form-group">
        <select *ngIf="configStatus.filtering"
          class="form-control"
           [ngTableFiltering]="configStatus.filtering"
           (tableChanged)="onChangeTable(configStatus)">
           <option value="">Select Status</option>
           <option>Unfulfilled</option>
           <option>Shipped</option>
        </select>
      </fieldset>
    </div>
  <div>

    <ng-customer-table [config]="config.sorting"
                (tableChanged)="onChangeTable(config)"
                (rowClicked)="onRowClicked($event)"
                [rows]="rows" [columns]="columns">
      </ng-customer-table>
      <pagination *ngIf="config.paging"
                  class="pagination-sm"
                  name="myform"
                  #myform="ngModel"
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
export class TableCustomerDemoComponent implements OnInit {

  @Input() public set data_in(values: Array<any>){
    this.data = values;
    this.length = this.data.length;
    this.onChangeTable(this.config);
  }

  @Output() public rowClicked: EventEmitter<any> = new EventEmitter();

  public rows: Array<any> = [];
  public columns: Array<any> = [
    { title: 'Order Date', name: 'order_date' },
    { title: 'Order Nickname', name: 'order_nickname' },
    { title: 'Customer Name', name: 'customer_name' },
    { title: 'Customer Email', name: 'customer_email' },
    { title: 'Order Quantity', name: 'order_quantity' },
    { title: 'Order Status', name: 'order_status' }
  ];
  public page: number = 1;
  public itemsPerPage: number = 10;
  public maxSize: number = 5;
  public numPages: number = 1;
  public length: number = 0;

  public config: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '', columnName: 'order_date' }
  };

  public configOrderDate: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '', columnName: 'order_date' }
  };

  public configNickname: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '', columnName: 'order_nickname' }
  };

  public configName: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '', columnName: 'customer_name' }
  };

  public configEmail: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '', columnName: 'customer_email' }
  };

  public configQuantity: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '', columnName: 'order_quantity' }
  };

  public configStatus: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '', columnName: 'order_status' }
  };

  errorMessage: string
  customers: Customer[]
  mode = 'Observable'

  private data: Array<any>;// = TableData;

  public constructor() { }

  public ngOnInit(): void {

  }

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
