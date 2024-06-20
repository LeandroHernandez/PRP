import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appToUpperCase]'
})
export class ToUpperCaseDirective {
  constructor(private el: ElementRef) {}

  @HostListener('keyup') onKeyUp() {
    const input = this.el.nativeElement as HTMLInputElement;
    input.value = input.value.toUpperCase();
  }
}