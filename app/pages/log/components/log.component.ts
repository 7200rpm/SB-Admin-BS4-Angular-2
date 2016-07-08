import {Component} from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
	moduleId: module.id,
	selector: 'log-cmp',
	templateUrl: 'log.component.html',
	directives: [ROUTER_DIRECTIVES]
})

export class LogComponent {}
