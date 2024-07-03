import { Component, OnInit } from '@angular/core';
import { Player } from 'app/models/jugador/jugador.model';
import { PlayerService } from 'app/services/player/player.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-athletes',
  templateUrl: './add-athletes.component.html',
  styleUrls: ['./add-athletes.component.css']
})
export class AddAthletesComponent implements OnInit {

  players$: Observable<Player[]>;

  constructor(private playerService: PlayerService) { }

  ngOnInit(): void {
  }

  savePlayer(): void {
    const newPlayer: Player = {
      playerId: 'some-unique-id',
      identification: '123456789',
      firstName: 'Jose ',
      lastName: 'Sanchez',
      birthdate: '2000-01-01',
      age: 22,
      educationalUnit: 'Unit 1',
      phone: '123-456-7890',
      gender: 'Male',
      level: 'Level 2', 
      address: '123 Main St',
      registrationDate: new Date().toISOString().split('T')[0],
    };
  
    this.playerService.addPlayer(newPlayer).subscribe({
      next: (result) => {
        console.log('Player saved successfully', result);
        // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito
      },
      error: (error) => {
        console.error('Failed to save player', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    });
  }
  

}
