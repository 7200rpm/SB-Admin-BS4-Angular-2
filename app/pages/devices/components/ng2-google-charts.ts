import {Directive, ElementRef, Input, OnInit} from '@angular/core';

declare var google: any;

@Directive({
  selector: 'google-chart'
})

export class GoogleChartComponent implements OnInit {

  public _element: any;
  @Input('chartType') public chartType: string;
  @Input('chartOptions') public chartOptions: Object;
  @Input('chartData') public chartData: any[];

  private static googleLoaded: any;

  constructor(public element: ElementRef) {
    this._element = this.element.nativeElement;
  }

  getGoogle() {
    return google;
  }
  ngOnInit() {
    console.log('ngOnInit');
    if (!GoogleChartComponent.googleLoaded) {
      GoogleChartComponent.googleLoaded = true;
      google.charts.load('current', { packages: ['corechart', 'line'] });
    }
    google.charts.setOnLoadCallback(() => this.drawGraph());
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

        var wrapper:any;
    wrapper = new google.visualization.ChartWrapper({
      chartType: this.chartType,
      dataTable: this.createDataTable(this.chartData),
      options: this.chartOptions || {},
      containerId: this._element.id
    });
    wrapper.draw();
  }

  createDataTable(array: any[]): any {
    return google.visualization.arrayToDataTable(array);
  }
}