import {Component, OnInit, EventEmitter, Input, Output, OnChanges, SimpleChange } from '@angular/core';
import {CORE_DIRECTIVES, NgClass, NgIf} from '@angular/common';
import {PAGINATION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {NG_TABLE_DIRECTIVES} from '../../../components/ng2-table';

import { FORM_DIRECTIVES }    from '@angular/forms';

import {LogService} 			from '../log.service'

// webpack html imports
//let template = require('./table-demo.html');

@Component({
  selector: 'table-api-log',
  template: `
  <div class="row">
  <div class="col-xl-3">
    <fieldset class="form-group">
      <input *ngIf="configIPaddress.filtering" placeholder="IP Address"
        class="form-control"
         [ngTableFiltering]="configIPaddress.filtering"
         (tableChanged)="onChangeTable(configIPaddress)"/>
    </fieldset>
  </div>
  <div class="col-xl-3">
    <fieldset class="form-group">
      <input *ngIf="configUser.filtering" placeholder="User"
        class="form-control"
         [ngTableFiltering]="configUser.filtering"
         (tableChanged)="onChangeTable(configUser)"/>
    </fieldset>
  </div>
  <div class="col-xl-4">
    <fieldset class="form-group">
      <input *ngIf="configEndpoint.filtering" placeholder="Endpoint"
      class="form-control"
         [ngTableFiltering]="configEndpoint.filtering"
         (tableChanged)="onChangeTable(configEndpoint)"/>
    </fieldset>
  </div>
  <div class="col-xl-2">
    <fieldset class="form-group">
      <input *ngIf="configResponseCode.filtering" placeholder="Response Code"
      class="form-control"
         [ngTableFiltering]="configResponseCode.filtering"
         (tableChanged)="onChangeTable(configResponseCode)"/>
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
export class TableAPILogComponent implements OnInit {

   @Input() public set data_in(values: Array<any>) {
      if (values) {
         this.data = values;
         for(var i = 0; i < this.data.length; i++) {
           var endpoint:string = this.data[i]['http_method'] + " " + this.data[i]['req_object'];
           if(this.data[i]['objectID'] != null) {
             endpoint += "/" + this.data[i]['objectID'];
           }
           if(this.data[i]['method'] != null) {
             endpoint += "/" + this.data[i]['method'];
           }
           this.data[i]['endpoint'] = endpoint;
         }
         this.length = this.data.length;
         this.onChangeTable(this.config);
      }
   }

  @Output() public rowClicked: EventEmitter<any> = new EventEmitter();

  public rows: Array<any> = [];
  public columns: Array<any> = [
    { title: 'Timestamp', name: 'requested_at' },
    { title: 'IP Address', name: 'IPaddress' },
    { title: 'User', name: 'name' },
    { title: 'Endpoint', name: 'endpoint' },
    { title: 'Response Code', name: 'response_code'},
    { title: 'Execution Time', name: 'execution_time'}
  ];
  public page: number = 1;
  public itemsPerPage: number = 10;
  public maxSize: number = 5;
  public numPages: number = 1;
  public length: number = 0;

  public config: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '', columnName: 'requested_at' }
  };

  public configIPaddress: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '', columnName: 'IPaddress' }
  };

  public configUser: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '', columnName: 'userID' }
  };

  public configEndpoint: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '', columnName: 'endpoint' }
  };

  public configResponseCode: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '', columnName: 'response_code' }
  };

  errorMessage: string
  events: any[]
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
