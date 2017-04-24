import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions}  from '@angular/http';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {AuthService} from '../login/auth.service';
import {AuthHttp} from 'angular2-jwt';


@Injectable()
export class DashboardService {

  private dashboardURL = 'https://wakeuserapi.azurewebsites.net/v1/dashboard';  // URL to web API

  constructor(private http: Http, private authHttp: AuthHttp) { }

  getDashboard(): Observable<any[]> {
    return this.authHttp.get(this.dashboardURL)
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
