import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  validateRuc(ruc: string): boolean {
    if (!ruc || ruc.length !== 13) {
      return false;
    }

    // Asegúrate de que los últimos tres dígitos sean 001
    if (ruc.slice(-3) !== '001') {
      return false;
    }

    // Usar la misma lógica de validación de cédula para los primeros 10 dígitos
    return this.validateCedula(ruc.substring(0, 10));
  }

  private validateCedula(cedula: string): boolean {
    if (cedula.length !== 10) {
      return false;
    }

    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    const digitoVerificador = parseInt(cedula[9], 10);
    let suma = 0;

    for (let i = 0; i < 9; i++) {
      let valor = parseInt(cedula[i], 10) * coeficientes[i];
      valor = valor > 9 ? valor - 9 : valor;
      suma += valor;
    }

    const verificador = suma % 10 === 0 ? 0 : 10 - suma % 10;
    return verificador === digitoVerificador;
  }
}
