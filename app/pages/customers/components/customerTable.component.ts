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
        <input *ngIf="configName.filtering" placeholder="Name"
          class="form-control"
           [ngTableFiltering]="configName.filtering"
           (tableChanged)="onChangeTable(configName)"/>
      </fieldset>
    </div>
    <div class="col-xl-3">
      <fieldset class="form-group">
        <input *ngIf="configEmail.filtering" placeholder="Email"
          class="form-control"
           [ngTableFiltering]="configEmail.filtering"
           (tableChanged)="onChangeTable(configEmail)"/>
      </fieldset>
    </div>
    <div class="col-xl-2">
      <fieldset class="form-group">
        <select *ngIf="configSource.filtering" placeholder="Source"
        class="form-control"
           [ngTableFiltering]="configSource.filtering"
           (tableChanged)="onChangeTable(configSource)">
            <option value=""><i>All Sources</i></option>
            <option>Kickstarter</option>
            <option>trycelery.com</option>
            <option>On Loan</option>
            <option>Other</option>
          </select>
      </fieldset>
    </div>
    <div class="col-xl-2">
      <fieldset class="form-group">
        <select *ngIf="configStatus.filtering" placeholder="Status"
        class="form-control"
         [ngTableFiltering]="configStatus.filtering"
         (tableChanged)="onChangeTable(configStatus)">
            <option value=""><i>All Status</i></option>
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

  @Output() public rowClicked: EventEmitter<any> = new EventEmitter();

  public rows: Array<any> = [];
  public columns: Array<any> = [
    { title: 'Name', name: 'name' },
    { title: 'Email', name: 'email' },
    { title: 'Source', name: 'source' },
    { title: 'Quantity', name: 'quantity' },
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
    filtering: { filterString: '', columnName: 'name' }
  };

  public configName: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '', columnName: 'name' }
  };

  public configEmail: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '', columnName: 'email' }
  };

  public configSource: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '', columnName: 'source' }
  };

  public configStatus: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '', columnName: 'status' }
  };

  errorMessage: string
  customers: Customer[]
  mode = 'Observable'

  private data: Array<any>;// = TableData;

  public constructor(
    private customerService: CustomerService) { }

  public ngOnInit(): void {
    this.getCustomers();


  }

  getCustomers() {
    this.customerService.getCustomers()
      .subscribe(
      customers => { this.data = customers; this.length = this.data.length; this.onChangeTable(this.config); },
      error => this.errorMessage = <any>error,
      () => console.log('Customers Completed!')
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
