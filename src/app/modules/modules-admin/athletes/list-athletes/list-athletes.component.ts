import { Component, OnInit } from '@angular/core';
import { DataTable } from 'app/models/academyarea/datatable';
import { Observable } from 'rxjs';
import { PlayerService } from 'app/services/player/player.service';
import { Player } from 'app/models/jugador/jugador.model';

declare var $: any;


@Component({
  selector: 'app-list-athletes',
  templateUrl: './list-athletes.component.html',
  styleUrls: ['./list-athletes.component.css']
})
export class ListAthletesComponent implements OnInit {

  players: Player[] = [];
  filteredPlayers: any[]; // Array filtrado que se mostrará en la tabla
  searchTerm: string = '';
  selectedYear: string = '';
  selectedMonth: string = '';
  selectedLevel: string = '';

  years: number[] = [];
  months: string[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12','27','28'];
  levels: string[] = ['Principiante', 'Intermedio', 'Avanzado']; // Ajusta según tus niveles


  constructor(private playerService: PlayerService) { }

  ngOnInit(): void {
   
    this.playerService.getAllPlayers().subscribe(players => {
      this.players = players;
      console.log(this.players)
      this.filteredPlayers = this.players;
    });
    this.generateYears();
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    const startYear = 2023; // O el año más antiguo que necesites
    const endYear = currentYear + 10; // 10 años hacia el futuro

    for (let year = startYear; year <= endYear; year++) {
      this.years.push(year);
    }
    this.years.reverse(); // Para que el año más reciente aparezca primero
  }
  
  applyFilters() {
    this.filteredPlayers = this.players.filter(player => {
      const registrationDate = new Date(player.registrationDate);
      const year = registrationDate.getFullYear().toString();
      const month = (registrationDate.getMonth() + 1).toString().padStart(2, '0');

      return (
        (this.searchTerm === '' || 
         player.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
         player.lastName.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
        (this.selectedYear === '' || year === this.selectedYear) &&
        (this.selectedMonth === '' || month === this.selectedMonth) &&
        (this.selectedLevel === '' || player.level === this.selectedLevel)
      );
    });
  }
  
}
