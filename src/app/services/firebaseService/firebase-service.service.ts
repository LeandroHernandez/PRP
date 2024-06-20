import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private firestore: firebase.firestore.Firestore;
  private initialized = false;

  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebase);
    }
    this.firestore = firebase.firestore();
  }

  async initializeFirestoreConnection(): Promise<void> {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          try {
            await this.firestore.enableNetwork();
            console.log('Conexión a Firestore establecida y usuario autenticado');
            resolve();
          } catch (error) {
            console.error('Error al habilitar la red de Firestore:', error);
            reject(error);
          }
        } else {
          console.log('Usuario no autenticado');
          reject('Usuario no autenticado');
        }
      });
    });
  }

  getFirestore() {
    return this.firestore;
  }
}
