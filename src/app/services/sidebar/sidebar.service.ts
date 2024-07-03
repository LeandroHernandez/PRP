import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menuItems: any[] = [];
  user: any

  constructor(public afs: AngularFirestore) { }

  renderMenu(): Observable<any> {
    if (this.menuItems.length > 0) {
      return of(this.menuItems)
    } else {
      const aux = JSON.parse(localStorage.getItem('user'));
      
      return this.afs.collection(`config/role_config/role/${aux.role}/menu`).get()
          .pipe(
              map(response => {
                const menuitems = [];
                response.docs.forEach( item => {
                  menuitems.push(item.data())
                })
                return menuitems;
              }),
              catchError(error => {
                return throwError(error);
              })
          );
    }
  }
}
