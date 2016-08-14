import { Injectable }     from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

import { ROUTER_DIRECTIVES } from '@angular/router';
import { Router }              from '@angular/router';

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {
	constructor(private auth: AuthService, private router: Router) { }

	canActivate() {
		if( this.auth.authenticated()) {return true;}

		console.error("Failed to authenticate...redirecting to login")

		this.router.navigate(['']);
		return false;
	}
}