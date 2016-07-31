import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions}  from '@angular/http';
import { Device }       from './device';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class DeviceService {

  private deviceURL = 'http://wakedotnet.azurewebsites.net/v1/devices';  // URL to web API
  private devices: Device[]

  constructor(private http: Http) { }

  getDevices(): Observable<Device[]> {
    return this.http.get(this.deviceURL)
      .map(res => res.json())
      .catch(this.handleError);
  }

  getDevice(id: number): Observable<Device> {
    //console.log(this.customers)
    //return this.customers.filter(customer => customer.customerID === id)
    return this.http.get(this.deviceURL + '/' + id)
      .map(res => res.json())
      .catch(this.handleError);

  }

  addDevice(device: Device): Observable<Device> {
    let body = JSON.stringify({ device });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.deviceURL, body, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  updateDevice(device: Device): Observable<Device> {
    let body = JSON.stringify({ device });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(this.deviceURL + '/' + device.deviceID, body, options)
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
