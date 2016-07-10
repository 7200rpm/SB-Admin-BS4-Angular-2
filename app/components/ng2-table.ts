import {NgCustomerTableComponent} from './table/ng-customer-table.component';
import {NgDeviceTableComponent} from './table/ng-device-table.component';

import {NgTableFilteringDirective} from './table/ng-table-filtering.directive';
import {NgTablePagingDirective} from './table/ng-table-paging.directive';
import {NgTableSortingDirective} from './table/ng-table-sorting.directive';

export * from './table/ng-customer-table.component';
export * from './table/ng-device-table.component';

export * from './table/ng-table-filtering.directive';
export * from './table/ng-table-paging.directive';
export * from './table/ng-table-sorting.directive';

export * from './ng-table-directives';

export default {
  directives: [
    NgCustomerTableComponent,
    NgDeviceTableComponent,
    NgTableFilteringDirective,
    NgTableSortingDirective,
    NgTablePagingDirective
  ]
};
