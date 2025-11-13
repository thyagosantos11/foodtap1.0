import { Directive, ElementRef, HostListener, Input } from '@angular/core';
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input() highlightColor: string = '#FFE5B4'; // Cor padrão (pêssego)
  @Input() normalColor: string = 'transparent';

  private initialBackgroundColor: string = '';

  constructor(private el: ElementRef) {
    this.initialBackgroundColor = this.el.nativeElement.style.backgroundColor;
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.style.backgroundColor = this.highlightColor;
    this.el.nativeElement.style.transition = 'background-color 0.3s ease';
    this.el.nativeElement.style.cursor = 'pointer';
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.el.nativeElement.style.backgroundColor = this.normalColor;
  }

  @HostListener('mousedown') onMouseDown() {
    this.el.nativeElement.style.transform = 'scale(0.98)';
    this.el.nativeElement.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  }

  @HostListener('mouseup') onMouseUp() {
    this.el.nativeElement.style.transform = 'scale(1)';
    this.el.nativeElement.style.boxShadow = 'none';
  }
}
