import {it, expect, describe, inject, beforeEachProviders} from '@angular/core/testing';
import {ComponentFixture} from '@angular/compiler/testing';
import {NgCustomerTableComponent} from './ng-customer-table.component';

describe('Directive: FileSelectDirective', () => {
  beforeEachProviders(() => [
    NgCustomerTableComponent
  ]);
  it('should be fine', inject([NgCustomerTableComponent], (fixture:ComponentFixture<NgCustomerTableComponent>) => {
    expect(fixture).not.toBeNull();
  }));
});
