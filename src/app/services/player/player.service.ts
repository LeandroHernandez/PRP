import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import { Observable, from, throwError } from 'rxjs';
import { AngularFirestore , AngularFirestoreCollection,DocumentReference} from '@angular/fire/firestore';
import { Player } from 'app/models/jugador/jugador.model';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private playerCollection: AngularFirestoreCollection<Player>;

  constructor(private db: AngularFirestore, public afAuth: AngularFireAuth) {

    this.playerCollection = this.db.collection<Player>(`player`)
   }

   // Método para guardar un jugador con ID automático
   public addPlayer(player: Player): Observable<DocumentReference> {
    player.status = false;
    return from(this.playerCollection.add(player))
      .pipe(
        catchError(this.handleError<DocumentReference>('addPlayer'))
      );
  }

  /**
   * Recupera todos los jugadores de la colección 'players' en Firestore.
   * Retorna un Observable que emite una lista de jugadores.
   * Cada jugador incluye su 'playerId' que corresponde al ID del documento en Firestore.
   * 
   * @returns Observable<Player[]> Lista de jugadores.
   */
  public getAllPlayers(): Observable<Player[]> {
    return this.playerCollection.valueChanges({ idField: 'playerId' });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      this.log(`${operation} failed: ${error.message}`);
      return throwError(error); // Rethrow it back to subscriber
      
    };
  }

  private log(message: string): void {
    console.log(message);
    // Aquí podrías agregar más lógica para mostrar el mensaje de error en la UI, por ejemplo, usando un servicio de alertas.
  }
  
}
