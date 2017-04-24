import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions}  from '@angular/http';
import { Customer, CustomerDetail }       from './customer';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {AuthService} from '../login/auth.service';
import {AuthHttp} from 'angular2-jwt';


@Injectable()
export class CustomerService {

  private customerURL = 'https://wakedashboardapi.azurewebsites.net/users';  // URL to web API
  private customers: Customer[]

  constructor(private http: Http, private authHttp: AuthHttp) { }

  getCustomers(): Observable<Customer[]> {
    return this.authHttp.get(this.customerURL)
      .map(res => res.json())
      .catch(this.handleError);
  }

  getCustomer(id: number): Observable<CustomerDetail> {
    return this.authHttp.get(this.customerURL + '/' + id)
      .map(res => res.json())
      .catch(this.handleError);
  }
/*
  addCustomer(customer: Customer): Observable<Customer> {
    
    let body = JSON.stringify({ customer });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.authHttp.post(this.customerURL, body)
      .map(res => res.json())
      .catch(this.handleError);
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    let body = JSON.stringify({ customer });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.authHttp.post(this.customerURL + '/' + customer.customerID, body)
      .map(() => customer)
      .catch(this.handleError);
  }

  deleteCustomer(customer: Customer): Observable<Customer> {
    let body = JSON.stringify({ customer });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.authHttp.post(this.customerURL + '/' + customer.customerID + '/delete', body)
      .map(() => customer)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    //this.customers = body;
    //console.log(this.customers)
    //return body.data || {};
    return body;
  }
*/
  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
