/* ===== app/auth.service.ts ===== */
import { Injectable }      from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import {Observable} from 'rxjs/Rx';

import { ROUTER_DIRECTIVES } from '@angular/router';
import { Router }              from '@angular/router';

// Avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class AuthService {

  public user: Object;

  private options = {
    auth: {
      //redirectUrl: 'http://localhost:5555/dashboard/home'
      redirect: false,
      sso: true
    },
    allowedConnections: ['twitter', 'facebook', 'gregjeslgmail-onmicrosoft-com'],
    theme: {
      logo: 'assets/img/wake_logo.png',
    },
    allowSignUp: false
  };

  // Configure Auth0
  lock = new Auth0Lock('5GfvZDr33yMGdXD6kV4ZcM3WzGL1rzK6', 'wake.auth0.com', this.options);

  constructor(private router: Router) {

    // localStorage.getItem('profile').then(profile:any => {
    //         this.user = JSON.parse(profile);
    //     }).catch(error:any => {
    //         console.log(error);
    //     });


    // Add callback for lock `authenticated` event
    this.lock.on("authenticated", (authResult: any) => {

      this.lock.getProfile(authResult.idToken, (error:any, profile:any)=>{
        if(error) return;

        this.user = profile;

              localStorage.setItem('id_token', authResult.idToken);
              localStorage.setItem('profile', JSON.stringify(profile));
      this.router.navigate(['/dashboard/home'])


      })



    });

    // this.lock.on("authenticated", function(authResult) {
    //   this.lock.getProfile(authResult.idToken, function(error, profile) {
    //     if (error) {
    //       // Handle error
    //       return;
    //     }

    //     localStorage.setItem('token', authResult.idToken);
    //     localStorage.setItem('profile', JSON.stringify(profile));
    //   });
    // });

    // this.lock.once('signin ready', function() {

    //   var link = $('<a class="a0-zocial a0-waad" href="#">' +
    //     '<span>Login with Fabrikam Azure AD</span></a>');

    //   link.on('click', function() {
    //     this.lock.getClient().login({
    //       connection: 'gregjeslgmail.onmicrosoft.com'
    //     });
    //     return false;
    //   });

    //         var iconList = $(this.$container).find('.a0-iconlist');
    //   iconList.append(link);

    // })



  }


  public login() {
        // Call the show method to display the widget.

        this.lock.show((err: any, profile: any, token: any) => {
            if (err) {
        alert(err);

        return;
            }

            alert(token)

            localStorage.setItem('id_token', token);

            this.router.navigate(['/dashboard/home'])


    });





        // return new Promise((resolve, reject) => {

        //  this.lock.show({}, (err: any, profile: any, token: any) => {
        //     if (err) {
        //        alert(err);
        //        reject(err)
        //        return;
        //     }

        //     localStorage.setItem('id_token', token);

        //     resolve(token)

        //  });


        // })

  };

  public authenticated() {
    // Check if there's an unexpired JWT
    // This searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired();
  };

  public logout() {
    // Remove token from localStorage
    localStorage.removeItem('id_token');
    this.router.navigate([''])
  };
}