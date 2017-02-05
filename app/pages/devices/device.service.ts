import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions}  from '@angular/http';
import { Device }       from './device';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {AuthHttp} from 'angular2-jwt';

@Injectable()
export class DeviceService {

  private deviceURL = 'https://wakeuserapi.azurewebsites.net/v1/devices';  // URL to web API
  private devices: Device[]

  constructor(private http: Http, private authHttp: AuthHttp) { }

  getDevices(): Observable<Device[]> {
    return this.authHttp.get(this.deviceURL)
      .map(res => res.json())
      .catch(this.handleError);
  }

  getDevice(id: string): Observable<Device> {
    //console.log(this.customers)
    //return this.customers.filter(customer => customer.customerID === id)
    return this.authHttp.get(this.deviceURL + '/' + id)
      .map(res => res.json())
      .catch(this.handleError);

  }

  addDevice(device: Device): Observable<Device> {
    let body = JSON.stringify({ device });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.authHttp.post(this.deviceURL, body)
      .map(res => res.json())
      .catch(this.handleError);
  }

  updateDevice(device: Device): Observable<Device> {
    let body = JSON.stringify({ device });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.authHttp.put(this.deviceURL + '/' + device.coreID, body, options)
      .map(() => device)
      .catch(this.handleError);
  }

  deleteDevice(device: Device): Observable<Device> {
    let body = JSON.stringify({ device });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.authHttp.post(this.deviceURL + '/' + device.coreID + '/delete', body)
      .map(() => device)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();

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
