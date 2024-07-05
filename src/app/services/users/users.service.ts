import { Injectable, NgZone } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, from,combineLatest, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { User } from 'app/models/interfaces/user';
import {AngularFireAuth} from '@angular/fire/auth';
import { FirebaseService } from '../firebaseService/firebase-service.service';
import { RoleService } from '../role/role.service';
import { DocumentRole } from 'app/models/class/class.documentrole';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private userCollection: AngularFirestoreCollection<User>;

  constructor(
     
    private auth: AngularFireAuth,
    private firebaseService: FirebaseService,
    private roleService: RoleService,
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    private ngZone: NgZone,

  ) { 
    this.userCollection = this.afs.collection<User>('users');
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
  updateUserStatus(uid: string, status: boolean): Observable<void> {
    return from(this.userCollection.doc(uid).update({ status_u: status })).pipe(
      catchError(error => {
        return throwError('Ocurrió un error al actualizar el estado del usuario. Por favor, intenta de nuevo.');
      })
    );
  }
  assignRoleToUser(uid: string, role: DocumentRole): Observable<void> {
    return from(this.userCollection.doc(uid).update({ user_type: role.role_name, role: role.role_uid })).pipe(
      catchError(error => {
        return throwError('Ocurrió un error al asignar el rol al usuario. Por favor, intenta de nuevo.');
      })
    );
  }
  async addUser(userData: User): Promise<void> {
    const email = userData.email;
    const password = userData.password;
    console.log('Datos del usuario a guardar 1:', userData);

    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      console.log('Usuario creado exitosamente', userCredential.user);

    await this.saveUserData(userCredential.user, userData);
      console.log('Datos de usuario guardados exitosamente');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error; // Lanza el error para que pueda ser manejado por el componente
    }
  }

  private async saveUserData(user: firebase.User, userD): Promise<void> {
    const userRef = this.afs.collection('users').doc(user.email);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      password: userD.password,
      identification: userD.identificacion,
      nombre: userD.nombre,
      apellido: userD.apellido,
      emailVerified: user.emailVerified,
      role: userD.role,
      user_type: userD.user_type,
      status_u: true,

    };

    await userRef.set(userData, { merge: true });
  }
  
  filterUsers(search: string): Observable<User[]> {
    // Filtrar por nombre
    const byName$ = this.afs.collection<User>('users', ref => ref.where('nombre', '==', search)).valueChanges({ idField: 'uid' });

    // Filtrar por identificación
    const byIdentification$ = this.afs.collection<User>('users', ref => ref.where('identification', '==', search)).valueChanges({ idField: 'uid' });

    // Combinar los resultados de ambas consultas
    return combineLatest([byName$, byIdentification$]).pipe(
      map(([usersByName, usersById]) => {
        // Combinar los resultados únicos de ambas consultas
        const combinedUsers = [...usersByName, ...usersById];
        const uniqueUsers = combinedUsers.filter((user, index, self) =>
          index === self.findIndex((u) => u.uid === user.uid)
        );
        return uniqueUsers;
      }),
      catchError(error => {
        throw new Error('Ocurrió un error al filtrar los usuarios. Por favor, intenta de nuevo.');
      })
    );
  }
 
  
}
