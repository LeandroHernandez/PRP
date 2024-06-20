import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]'
})
export class OnlyNumbersDirective {

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    // Incluye 'Comma' y 'Period' en la lista de teclas especiales permitidas
    if (['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape', 'Comma', 'Period'].includes(event.key)
        || this.isNumberKey(event.key)) {
      return; // Permitir teclas de control, números, punto y coma
    } else {
      event.preventDefault(); // Detener otros caracteres
    }
  }

  private isNumberKey(char: string): boolean {
    // Actualiza la expresión regular para incluir dígitos y el punto decimal y la coma
    const regex = new RegExp('^[0-9.,]*$');
    return regex.test(char);
  }

}
