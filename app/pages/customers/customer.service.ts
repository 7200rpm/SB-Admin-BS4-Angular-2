import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions}  from '@angular/http';
import { Customer }       from './customer';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class CustomerService {

  private customerURL = 'http://wakeapi.azurewebsites.net/v1/customers';  // URL to web API
  private customers: Customer[]

  constructor(private http: Http) { }

  getCustomers(): Observable<Customer[]> {
    return this.http.get(this.customerURL)
      .map(res => res.json())
      .catch(this.handleError);
  }

  getCustomer(id: number): Observable<Customer> {
    //console.log(this.customers)
    //return this.customers.filter(customer => customer.customerID === id)
    // return this.http.get(this.customerURL)
    //   .toPromise()
    //   .then(res => res.json())
    //   .then(cus => cus.filter((c: Customer) => c.customerID === id)[0])
    return this.http.get(this.customerURL + '/' + id)
      .map(res => res.json())
      .catch(this.handleError);

  }

  addCustomer(customer: Customer): Observable<Customer> {
    let body = JSON.stringify({ customer });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.customerURL, body, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    let body = JSON.stringify({ customer });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(this.customerURL + '/' + customer.customerID, body, options)
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

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
