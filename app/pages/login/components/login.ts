import {Component} from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Router }              from '@angular/router';

import {AuthService} from '../auth.service'

@Component({
	selector: 'login-cmp',
	templateUrl: './pages/login/components/login.html',
	providers: [AuthService],
	directives: [ROUTER_DIRECTIVES]
})

export class LoginComponent {
	constructor(private router: Router, private auth: AuthService) {
		if(this.auth.authenticated()){
			this.router.navigate(['/dashboard/home'])
		}

	 }

	 // login(){
	 // 	this.auth.login().then((success:any)=>{
	 // 		this.router.navigate(['/dashboard/home'])
	 // 	})
	 // }

}
