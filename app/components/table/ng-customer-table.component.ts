import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CORE_DIRECTIVES, NgClass} from '@angular/common';
import {NgTableSortingDirective} from './ng-table-sorting.directive';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Router }      from '@angular/router';

@Component({
  selector: 'ng-customer-table',
  template: `
    <table class="table table-striped table-bordered dataTable"
           role="grid" style="width: 100%;">
      <thead>
      <tr role="row">
        <th *ngFor="let column of columns" [ngTableSorting]="config" [column]="column" (sortChanged)="onChangeTable($event)">
          {{column.title}}
          <i *ngIf="config && column.sort" class="pull-right fa"
            [ngClass]="{'fa-chevron-down': column.sort === 'desc', 'fa-chevron-up': column.sort === 'asc'}"></i>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let row of rows" (click)="onRowClicked(row)" [attr.class]="row.devices ? 'table-success' : 'table-warning'">
        <td *ngFor="let column of columns">{{getData(row, column.name)}}</td>
      </tr>
      </tbody>
    </table>
`,
  directives: [NgTableSortingDirective, NgClass, CORE_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class NgCustomerTableComponent {
  // Table values
  @Input() public rows: Array<any> = [];
  @Input() public config: any = {};

  // Outputs (Events)
  @Output() public tableChanged: EventEmitter<any> = new EventEmitter();
  @Output() public rowClicked: EventEmitter<any> = new EventEmitter();

  @Input()
  public set columns(values: Array<any>) {
    values.forEach((value: any) => {
      let column = this._columns.find((col: any) => col.name === value.name);
      if (column) {
        Object.assign(column, value);
      }
      if (!column) {
        this._columns.push(value);
      }
    });
  }

  public get columns(): Array<any> {
    return this._columns;
  }

  public get configColumns(): any {
    let sortColumns: Array<any> = [];

    this.columns.forEach((column: any) => {
      if (column.sort) {
        sortColumns.push(column);
      }
    });

    return { columns: sortColumns };
  }

  private _columns: Array<any> = [];

  public onRowClicked(row: any): void {
    this.rowClicked.emit(row)
  }

  public onChangeTable(column: any): void {
    this._columns.forEach((col: any) => {
      if (col.name !== column.name && col.sort !== false) {
        col.sort = '';
      }
    });
    this.tableChanged.emit({ sorting: this.configColumns });
  }

  public getData(row: any, propertyName: string): string {
    // if (propertyName == "order.device") {
    //   if (row.order.device){
    //     return 'Shipped to <a href="dashboard/customer/{{d.order.customer.customerID}}">{{row.customer.first_name}} {{row.customer.last_name}}</a>';
    //   }
    //   else return 'In Stock'
    // }
    // else {
    //   return propertyName.split('.').reduce((prev: any, curr: string) => prev[curr], row);
    // }
    return propertyName.split('.').reduce((prev: any, curr: string) => prev[curr], row);
  }
}
