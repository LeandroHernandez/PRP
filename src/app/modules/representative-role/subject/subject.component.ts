import { Component, OnInit } from '@angular/core';
import { SendDataService } from 'app/services/sendData/send-data.service';
import { Router } from '@angular/router';
import { Subject } from '../../../models/class/classdocumentSubject';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {

  public arrayMaterias: Subject[];
  arrayDetail = [];
  tabsunidades = [];
  constructor( private sendDataService: SendDataService, private router: Router) { }

  ngOnInit(): void {
    history.pushState(null, '', '/representativehome');
    this.arrayMaterias = this.sendDataService.getArray();
    this.arrayDetail = [
      {
        classNumber: 'Clase 1',
        video1: true,
        nameVideo1: 'video 1',
        titleVideo1: 'Contar Numeros',
        video2: true,
        nameVideo2: 'video 2',
        titleVideo2: 'Contar Numeros',
        fechaFin: '19-feb-2020',
        numTask: 7,
        totalTask: 10
      },
      {
        classNumber: 'Clase 1',
        video1: true,
        nameVideo1: 'video 1',
        titleVideo1: 'Contar Numeros',
        video2: true,
        nameVideo2: 'video 2',
        titleVideo2: 'Contar Numeros',
        fechaFin: '19-feb-2020',
        numTask: 7,
        totalTask: 10
      },
      {
        classNumber: 'Clase 1',
        video1: true,
        nameVideo1: 'video 1',
        titleVideo1: 'Contar Numeros',
        video2: true,
        nameVideo2: 'video 2',
        titleVideo2: 'Contar Numeros',
        fechaFin: '19-feb-2020',
        numTask: 7,
        totalTask: 10
      }
    ]

    this.tabsunidades = ['Unidad 1', 'Unidad 2', 'Unidad 3']
  }

  showDetail(item) {
    this.sendDataService.setArraySecondary(item);
    this.sendDataService.setArray(this.arrayMaterias);
    const contexto = this;
    contexto.router.navigate(['subjectsdetail']);
  }

}
