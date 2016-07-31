import {
  Component, OnDestroy, OnInit, OnChanges, EventEmitter, ElementRef, Input,
  Output
} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass} from '@angular/common';

declare var vis: any;

@Component({
  selector: 'ng-vis',
  template: `<div id="visualization"></div>`,
  directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass]
})
export class BaseVisComponent implements OnDestroy, OnChanges, OnInit {

  @Input() public data: Array<any[]>;
  @Input() public options: any;

  @Output() public visSelect: EventEmitter<any> = new EventEmitter();
  // @Output() public chartHover: EventEmitter<any> = new EventEmitter();


  private timeline: any;
  private initFlag: boolean = false;

  private element: ElementRef;

  public constructor(element: ElementRef) {
    this.element = element;
  }

  public ngOnInit(): any {


    this.initFlag = true;

    if (this.data) {
      this.refresh();
    }
  }

  public ngOnChanges(): any {
    if (this.initFlag) {
      this.refresh();
    }
  }

  public ngOnDestroy(): any {
    if (this.timeline) {
      this.timeline.destroy();
      this.timeline = void 0;
    }
  }

  public getTimelineBuilder(): any {
    let datasets = new vis.DataSet(this.data)

    let options: any = Object.assign({}, this.options);

    options = {
      width: '100%',
      height: '300px'
    }

    var t = new vis.Timeline(this.element.nativeElement, datasets, options);

    var timelineEvents = [
      'rangechange',
      'rangechanged',
      'timechange',
      'timechanged',
      'select',
      'doubleClick',
      'click',
      'contextmenu'
    ];

    t.on('select', (x: any) => {this.visSelect.emit({x})})

    // t.on('select', function(properties: any) {
    //   this.select.emit({ event, properties });
    //   this.
    // });



    return t;
  }

  private refresh(): any {
    this.ngOnDestroy();
    this.timeline = this.getTimelineBuilder();

  }
}

export const VIS_DIRECTIVES: Array<any> = [BaseVisComponent];
