import {inject, Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
class AuthGuard {

  constructor(private router: Router, private jwtService: JwtHelperService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.jwtService.isTokenExpired()) {
      void this.router.navigate(['']);
      return false;
    } else {
      return true;
    }
  }

}

export const IsAuthGuard:
  CanActivateFn = (route: ActivatedRouteSnapshot,
                   state: RouterStateSnapshot): boolean => {
  return inject(AuthGuard).canActivate(route, state)
}

