import { Component, OnInit } from '@angular/core';
import { SendDataService } from 'app/services/sendData/send-data.service';
import { Subject } from '../../../models/class/classdocumentSubject';

@Component({
  selector: 'app-list-detail-subject',
  templateUrl: './list-detail-subject.component.html',
  styleUrls: ['./list-detail-subject.component.css']
})
export class ListDetailSubjectComponent implements OnInit {
  ga: any;
  public arrayMaterias: Subject[];
  arrayDetail = [];
  dataSource;
  displayedColumns  = ['Material', 'Completado', 'Duracion', 'Errores', 'Aciertos', 'FechaHora'];
  constructor(private sendDataService: SendDataService) { }

  ngOnInit(): void {
    history.pushState(null, '', '/representativehome');
    this.arrayMaterias = this.sendDataService.getArray();
    this.arrayDetail = this.sendDataService.getArraySecondary();
    this.dataSource = [
      {
        nombre: 'video',
        completado: 12,
        duracion: '3:00',
        errores: '--',
        aciertos: '--',
        fechahora: '01/06/20 09:05am'
      },
      {
        nombre: 'video 2',
        completado: 30,
        duracion: '3:00',
        errores: '--',
        aciertos: '--',
        fechahora: '01/06/20 09:05am'
      }
    ]
  }

}
