import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { User } from 'app/models/interfaces/user';
import {AngularFireAuth} from '@angular/fire/auth';
import { FirebaseService } from '../firebaseService/firebase-service.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private userCollection: AngularFirestoreCollection<User>;

  constructor(private firestore: AngularFirestore,  private auth: AngularFireAuth,
    private firebaseService: FirebaseService
  ) { 
    this.userCollection = this.firestore.collection<User>('users');
  }

  /**
   * Obtiene todos los usuarios de la colección "/users" en Firestore.
   * 
   * @returns Un Observable que emite un array de objetos User.
   * 
   * @throws Un error si hay problemas al acceder a Firestore o si la colección está vacía.
   */
  getAllUsers(): Observable<User[]> {
    return this.userCollection.valueChanges({ idField: 'uid' })
      .pipe(
        map(users => {
          if (users.length === 0) {
            throw new Error('No se encontraron usuarios en la base de datos.');
          }
          return users;
        }),
        catchError(error => {
          if (error.code === 'permission-denied') {
            return throwError('No tienes permisos para acceder a esta información.');
          }
          if (error.code === 'unavailable') {
            return throwError('El servicio no está disponible en este momento. Por favor, intenta más tarde.');
          }
          return throwError('Ocurrió un error al obtener los usuarios. Por favor, intenta de nuevo.');
        })
      );
  }

  deleteUser(uid: string): Observable<void> {
    //this.firebaseService.initializeFirestoreConnection();
    console.log("uid -----> ", uid)
    return from(this.auth.currentUser).pipe(
      switchMap(currentUser => {
        if (!currentUser) {
          throw new Error('No hay usuario autenticado');
        }
        return from(currentUser.delete());
      })
    );
  }
  

  
}
