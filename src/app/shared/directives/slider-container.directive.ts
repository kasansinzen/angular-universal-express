import { Directive, AfterViewInit, ElementRef } from '@angular/core';
declare var $: any;

@Directive({
  selector: '[appSliderContainer]'
})
export class SliderContainerDirective implements AfterViewInit {

  constructor(
    private el: ElementRef
  ) {
  }

  ngAfterViewInit() {
    if ($('#slider__activation__wrap').length) {
      $('#slider__activation__wrap').owlCarousel({
      loop: true,
      margin:0,
      nav:true,
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
      smartSpeed: 1000,
      autoplay: false,
      navText: [ '<i class="icon-arrow-left icons"></i>', '<i class="icon-arrow-right icons"></i>' ],
      autoplayTimeout: 10000,
      items:1,
      dots: false,
      lazyLoad: true,
      responsive: {
        0: {
          items: 1,
        },
        767: {
          items: 1,
        },
        991: {
          items: 1,
        }
      }
      });
    }
  }
}
