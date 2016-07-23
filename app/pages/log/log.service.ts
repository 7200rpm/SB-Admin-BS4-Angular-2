import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions}  from '@angular/http';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class LogService {

  private logURL = 'http://wakeapi.azurewebsites.net/v1/log';  // URL to web API
  private log_events: any[]

  private last_error: any[]

  constructor(private http: Http) { }

  getLog(): Observable<any[]> {
    return this.http.get(this.logURL)
      .map(res => res.json())
      .catch(this.handleError);
  }

  getLogEvent(id: number): Observable<any> {

    return this.http.get(this.logURL + '/' + id)
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
