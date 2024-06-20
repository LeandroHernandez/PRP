import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

  private fileSource = new BehaviorSubject<File | null>(null);
  file$ = this.fileSource.asObservable();

  constructor() { }

  setFile(file: File | null): void {
    //console.log("Llegue")
    this.fileSource.next(file);
  }

  clearFile(): void {
    this.fileSource.next(null);
  }
}
