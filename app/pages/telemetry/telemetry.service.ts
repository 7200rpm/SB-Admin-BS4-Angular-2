import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions}  from '@angular/http';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class TelemetryService {

  private telemetryURL = 'http://wakeapi.azurewebsites.net/v1/telemetry';  // URL to web API
  private events: any[]

  constructor(private http: Http) { }

  getTelemetry(): Observable<any[]> {
    return this.http.get(this.telemetryURL)
      .map(res => res.json())
      .catch(this.handleError);
  }

  getEvent(id: number): Observable<any> {

    return this.http.get(this.telemetryURL + '/' + id)
      .map(res => res.json())
      .catch(this.handleError);

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
