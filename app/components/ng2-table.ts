import {NgTableComponent} from './table/ng-table.component';

import {NgTableFilteringDirective} from './table/ng-table-filtering.directive';
import {NgTablePagingDirective} from './table/ng-table-paging.directive';
import {NgTableSortingDirective} from './table/ng-table-sorting.directive';

export * from './table/ng-table.component';

export * from './table/ng-table-filtering.directive';
export * from './table/ng-table-paging.directive';
export * from './table/ng-table-sorting.directive';

export * from './ng-table-directives';

export default {
  directives: [
    NgTableComponent,
    NgTableFilteringDirective,
    NgTableSortingDirective,
    NgTablePagingDirective
  ]
};
