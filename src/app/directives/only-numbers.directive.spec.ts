import { OnlyNumbersDirective } from './only-numbers.directive';
import { ElementRef } from '@angular/core';

describe('OnlyNumbersDirective', () => {
  it('should create an instance', () => {
    const elRefMock = { nativeElement: document.createElement('input') };
    const directive = new OnlyNumbersDirective(elRefMock as ElementRef);
    expect(directive).toBeTruthy();
  });
});
