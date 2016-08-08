import {Directive, ElementRef, Input, OnInit, AfterViewInit} from '@angular/core';

declare var google: any;

@Directive({
  selector: 'google-chart'
})

export class GoogleChartComponent implements OnInit, AfterViewInit {

  public _element: any;
  @Input('chartType') public chartType: string;
  @Input('chartOptions') public chartOptions: Object;
  @Input('chartData') public set chartData(values: Array<any>) {

    if (!GoogleChartComponent.googleLoaded || !values) return;

    this.data = values;
    this.drawGraph();
  }

  public imageURI: string;

  private data: Array<any>;

  private static googleLoaded: any;

  constructor(public element: ElementRef) {
    this._element = this.element;
  }

  getGoogle() {
    return google;
  }

  ngOnInit() {
    console.log('Google Charts ngOnInit');
    if (!GoogleChartComponent.googleLoaded) {
      GoogleChartComponent.googleLoaded = true;
      google.charts.load('current', { packages: ['corechart', 'line'] });

    }
    google.charts.setOnLoadCallback(() => this.drawGraph());
  }

  ngAfterViewInit() {

  }

  drawGraph() {
    //   this.data = this.createDataTable([
    //   ['Evolution', 'Imports', 'Exports'],
    //   ['A', 8695000, 6422800],
    //   ['B', 3792000, 3694000],
    //   ['C', 8175000, 800800]
    // ]);

    // this.options = {
    //   title: 'Evolution, 2014',
    //   chartArea: {width: '50%'},
    //   hAxis: {
    //     title: 'Value in USD',
    //     minValue: 0
    //   },
    //   vAxis: {
    //     title: 'Members'
    //   }
    // };

    if (!GoogleChartComponent.googleLoaded) return;

    if (!this.data) return;

    var wrapper: any;
    wrapper = new google.visualization.ChartWrapper({
      chartType: this.chartType,
      dataTable: this.createDataTable(this.data),
      options: this.chartOptions || {},
      containerId: this._element.nativeElement
    });
    wrapper.draw();
    if(wrapper != null && wrapper.getChart() != null && wrapper.getChart().getImageURI() != null) {
      console.log(wrapper.getChart().getImageURI());
      this.imageURI = wrapper.getChart().getImageURI();
    }
  }

  createDataTable(array: any[]): any {
    return google.visualization.arrayToDataTable(array);
  }
}