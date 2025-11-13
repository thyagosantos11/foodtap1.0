import { Directive, ElementRef, HostListener, Input } from '@angular/core';
@Directive({
  selector: '[backAppHighlight]'
})
export class BackHighlightDirective {
  @Input() highlightBackColor: string = '#c0ac9bff';
  @Input() normalBackColor: string = '#ffffffff';

  private initialBackColor: string = '';

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.style.backgroundColor = this.highlightBackColor;
    this.el.nativeElement.style.transition = 'background-color 0.3s ease';
    this.el.nativeElement.style.cursor = 'pointer';
    this.el.nativeElement.style.borderRadius = '12px'; 
    this.el.nativeElement.style.padding = '8px 16px'; 

  }

  @HostListener('mouseleave') onMouseLeave() {
    this.el.nativeElement.style.backgroundColor = this.normalBackColor;
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