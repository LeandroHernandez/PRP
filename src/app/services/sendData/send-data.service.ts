import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SendDataService {
  arrayService: any[];
  arraySecondary: any[];
  constructor() { }


  setArray(array: any) {
    this.arrayService = array;
  }

  getArray() {
    return this.arrayService;
  }

  setArraySecondary(array: any) {
    this.arraySecondary = array;
  }

  getArraySecondary() {
    return this.arraySecondary;
  }
}
