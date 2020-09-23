
import * as am4core from "@amcharts/amcharts4/core";
import "./style.css"; // webpack will handing this loading...
import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_animated from '@amcharts/amcharts4/themes/animated';

import {
    ICSVOptions,
    object,
    options,
    ResizeButton
} from "@amcharts/amcharts4/core";

import {
    AxisLabel,
    AxisLine,
    ICategoryAxisDataFields,
    LineSeries,
    ValueAxis,
    XYChart,
    XYChartScrollbar,
    XYSeries,
} from "@amcharts/amcharts4/charts";

// import { IDurationAxisDataFields } from "@amcharts/amcharts4/.internal/charts/axes/DurationAxis";
import {IDateAxisDataFields} from "@amcharts/amcharts4/.internal/charts/axes/DateAxis";
import {IValueAxisDataFields} from "@amcharts/amcharts4/.internal/charts/axes/ValueAxis";
import {ISpriteProperties} from '@amcharts/amcharts4/.internal/core/Sprite';

// am4core.useTheme(am4themes_animated);

// *****************************************************

/*
    initData
        Get x,y data file from github
    initDemoData
        Init demoData ready to use for charts from rawData
        Called by
            initData
            Change in clipping of y values (user initiated)
    customizeGrip
        Customize grips for zoomed in section of the XYChartScrollbar
        Called by
            initScrollbar
    initToolTips
        Define some tooltip styling parameters
        Called by
            initChart
    initScrollbar
        Create an XYChartScrollbar and assgne to a chart
        Initialise various configuration settings
        Called by
            initChart
    initBullets
        Setup CircleBullet for series.bullets
        Called by
            initChart
    initAxes
        Initialise axes for a chart
        Called by
            initChart
    initSeries
        Add a LineSeries to a given chart
        Called by
            initChart
    initCursor
        Add an XYCursor to a given chart
        Set some configuration parameters
        Called by
            initChart
            Change in cursorSnap status (user initiated)
    toggleOppositeAxes
        Allow the rendering of opposite (x & y) axes of a given chart to be enabled/disabled
        Called by
            initAxes
            Change in oppositeAxes status (user initiated)
    initChart
        Initialise a chart for a given x-axis type (ValueAxis, DateAxis or CategoryAxis)
        Called by
            initData
    zoomTo
        Call the x-axis zoom function for each chart using start, end values
        Called by
            button click listener for
                Zoom In
                Show Full Range
 */
// *****************************************************

enum X_AXIS_TYPE {
    numbers,
    dates,
    categories
}

const xColName = "channel";
const dateColName = "date";
const categoryColName = "category";
const yColName = "y";

let charts: am4charts.XYChart[] = [];
let rawData: any[] = [];
let demoData: any[];

let xMin = 1e6;
let xMax = -1e6;
let yMin = 1e6;
let yMax = -1e6;

// const axLine: ISpriteProperties = {
const axLine = {
    strokeOpacity: 1,
    strokeWidth: 2,
    stroke: am4core.color("#3787ac"),
};
// const axTicks: ISpriteProperties = {
const axTicks = {
    disabled: false,
    strokeOpacity: 1,
    stroke: am4core.color("#495C43"),
    strokeWidth: 3,
    length: 10,
};

// *******************************************************

const dInfo = document.getElementById("dInfo")!;

document.getElementById("btn1")!.addEventListener("click", () => {

    zoomTo(240 / 800, 3 / 8);
    // zoomTo(200, 300)
});
document.getElementById("btn2")!.addEventListener("click", () => {

    zoomTo(0, 1);
    // zoomTo(0, 799)
});

document.getElementById("yClip")!.addEventListener("change", (evt: any) => {

    if (evt.target.checked) {

        initDemoData(true);

    } else {

        initDemoData();
    }
    charts[0].data = demoData;
    charts[1].data = demoData;
    charts[2].data = demoData;
});

document.getElementById("cursorSnap")!.addEventListener("change", (evt: any) => {

    const snapFlag = evt.target.checked;

    initCursor(charts[0], snapFlag);
    initCursor(charts[1], snapFlag);
    initCursor(charts[2], snapFlag);
});

document.getElementById("oppositeAxes")!.addEventListener("change", (evt: any) => {

    const oppAxFlag = evt.target.checked;

    toggleOppositeAxes(charts[0], oppAxFlag);
    toggleOppositeAxes(charts[1], oppAxFlag);
    toggleOppositeAxes(charts[2], oppAxFlag);
});

// *********************************************************

function initData() {

    const dataSource = new am4core.DataSource();
    // dataSource.url = "testData.csv";
    dataSource.url =
        "https://raw.githubusercontent.com/zoony/AutoscaleOnZoom/master/dist/testData.csv";
    dataSource.parser = new am4core.CSVParser();

    (dataSource.parser.options as ICSVOptions).useColumnNames = true; // ************************************

    dataSource.load();
    dataSource.events.on("done", function (ev) {
        // Data loaded and parsed

        rawData = ev.target.data;

        xMin = 0;
        xMax = rawData.length - 1;

        initDemoData();

        charts.push(initChart(0, "chartdiv1", demoData, X_AXIS_TYPE.numbers));
        charts.push(initChart(1, "chartdiv2", demoData, X_AXIS_TYPE.dates));
        charts.push(initChart(2, "chartdiv3", demoData, X_AXIS_TYPE.categories));
    });
    dataSource.events.on("error", function (ev) {
        console.log("Oopsy! Something went wrong");
    });
}

// *********************************************************

function initDemoData(
    clipFlag?: boolean
): void {

    const firstDate = new Date();

    yMin = 1e6;
    yMax = -1e6;

    demoData = rawData.map((row, index) => {
        const x = parseFloat(row.x);
        const y = parseFloat(row.y);

        if (y > yMax) {
            yMax = y;
        }
        if (y < yMin) {
            yMin = y;
        }
        // if (row[1] > yMax) {
        //     yMax = row[1];
        // }
        // if (row[1] < yMin) {
        //     yMin = row[1];
        // }
        const newDate = new Date(firstDate);
        newDate.setDate(newDate.getDate() + index);
        return {
            channel: index,
            x: x,
            y: clipFlag && y < 0 ? 0 : y,
            // y: (clipFlag && row[1] < 0) ? 0 : row[1],
            date: newDate,
            // category: x.toFixed(3)
            category: index.toString()
        };
    });
    if (clipFlag && yMin < 0) {
        yMin = 0;
    }
    let s = `Data: x[${xMin} => ${xMax}] `;
    const yMinStr =
        yMin < 0
            ? `<span class='neg-val'>${yMin.toFixed(1)}</span>`
            : yMin.toFixed(1);
    s += `y[${yMinStr} => ${yMax.toFixed(1)}]`;
    dInfo.innerHTML = s;
}

// *********************************************************

function customizeGrip(
    grip: ResizeButton,
    gripCol: string,
    gripColLighten: number
) {
    // Remove default grip image
    grip.icon.disabled = true;

    // Disable background
    grip.background.disabled = true;

    var img = grip.createChild(am4core.Circle);
    img.width = 15;
    img.height = 15;
    img.fill = am4core.color(gripCol).lighten(gripColLighten);
    // img.fillOpacity = 0.5;
    // img.rotation = 45;
    img.align = "center";
    img.valign = "middle";

    // Add vertical bar
    // var line = grip.createChild(am4core.Rectangle);
    // line.height = 60;
    // line.width = 1;
    // line.fill = am4core.color("blue");
    // line.align = "center";
    // line.valign = "middle";
}

function initToolTips(
    series: LineSeries
) {

    series.tooltipText = "{valueY}";

    if (series.tooltip) {

        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.background.cornerRadius = 20;
        series.tooltip.background.fillOpacity = 0.5;
        series.tooltip.label.padding(12, 12, 12, 12);
    }
}

function initScrollbar(
    chart: XYChart,
    series: LineSeries
) {

    const sb = new am4charts.XYChartScrollbar();
    chart.scrollbarX = sb;

    sb.series.push(series);

    // sb.dy = 10;

    sb.scrollbarChart.plotContainer.filters.clear();
    sb.cursorOverStyle = am4core.MouseCursorStyle.default;

    sb.background.config = {
        stroke: am4core.color("blue").lighten(0.5),
        strokeOpacity: 0.2,
        fill: am4core.color("white"),
        fillOpacity: 0
    }
    // sb.background.disabled = true;

    sb.unselectedOverlay.disabled = true;
    //     sb.unselectedOverlay.fill = am4core.color("green");
    //     sb.unselectedOverlay.fill = am4core.color("blue").alternative;
    //     sb.unselectedOverlay.fillOpacity = 1;
    //     sb.unselectedOverlay.stroke = am4core.color('#ccc');
    //     sb.unselectedOverlay.strokeWidth = 1;

    sb.thumb.background.config = {
        stroke: am4core.color("blue").lighten(0.5),
        strokeWidth: 2,
        strokeOpacity: 0.5,
        fill: am4core.color("white"),
        fillOpacity: 1,
        zIndex: 1
    }

    // ********************************************************************

    let thumbHoverState;

    thumbHoverState = sb.thumb.background.states.getKey('hover');

    if (!thumbHoverState) {

        thumbHoverState = sb.thumb.states.create('hover');
    }

    thumbHoverState.properties.fill = am4core.color('yellow').lighten(0.2);
    thumbHoverState.properties.fillOpacity = 0.3;

    // ********************************************************************

    let thumbDownState;

    thumbDownState = sb.thumb.background.states.getKey('down');

    if (!thumbDownState) {

        thumbDownState = sb.thumb.states.create('down');
    }

    thumbDownState.properties.fill = am4core.color('green').lighten(0.75);
    thumbDownState.properties.fillOpacity = 0.6;

    // ********************************************************************

    sb.scrollbarChart.zIndex = 100;

    const scrollAxis = sb.scrollbarChart.xAxes.getIndex(0);
    if (scrollAxis) {

        scrollAxis.renderer.labels.template.disabled = true;
    }
    // scrollAxis.renderer.grid.template.disabled = true;

    customizeGrip(sb.startGrip, "blue", 0.5);
    customizeGrip(sb.endGrip, "blue", 0.5);

}

function initBullets(
    series: LineSeries
) {

    series.minBulletDistance = 8;

    const bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.config = {
        // fill: am4core.color("#00f"),
        // fillOpacity: 0.5,
        strokeWidth: 0,
        radius: 3
    }

    const bullethover = bullet.states.create("hover");
    bullethover.properties.scale = 2;
}

function initAxes(
    chart: XYChart,
    xAxisType: X_AXIS_TYPE
) {

    // ************************************************

    const initLine = (axis: ValueAxis | am4charts.DateAxis | am4charts.CategoryAxis) => {

        axis.renderer.line.config = axLine;
    };
    const initTicks = (axis: ValueAxis | am4charts.DateAxis | am4charts.CategoryAxis) => {

        axis.renderer.ticks.template.config = axTicks;
    };

    // ************************************************

    let xAxisBottom: ValueAxis | am4charts.DateAxis | am4charts.CategoryAxis;
    let xAxisTop: ValueAxis | am4charts.DateAxis | am4charts.CategoryAxis;

    switch (xAxisType) {

        case X_AXIS_TYPE.numbers:

            xAxisBottom = new am4charts.ValueAxis();

            chart.xAxes.push(xAxisBottom);

            xAxisBottom.dataFields.data = xColName;
            // (xAxisBottom.dataFields as IValueAxisDataFields).data = xColName;
            // xAxisBottom.dataFields.valueX = xColName;      // works be no sign of valueX .....??!!
            // (xAxisBottom.dataFields as IValueAxisDataFields).valueX = xColName;
            //   (xAxisBottom.dataFields as IDateAxisDataFields).date = dateColName;
            // console.log(xAxisBottom.renderer.grid);

            xAxisTop = new am4charts.ValueAxis();

            chart.xAxes.push(xAxisTop);

            xAxisTop.dataFields.data = xColName;
            // xAxisTop.dataFields.valueX = xColName;

            // ************************************************
            //             xAxisBottom.strictMinMax = true;
            //             xAxisTop.strictMinMax = true;
            // ************************************************

            break;

      case X_AXIS_TYPE.dates:

            xAxisBottom = new am4charts.DateAxis();

            chart.xAxes.push(xAxisBottom);

            (xAxisBottom.dataFields as IDateAxisDataFields).date = dateColName;

            xAxisTop = new am4charts.DateAxis();

            chart.xAxes.push(xAxisTop);

            (xAxisTop.dataFields as IDateAxisDataFields).date = dateColName;
            break;

        case X_AXIS_TYPE.categories:

            xAxisBottom = new am4charts.CategoryAxis();

            chart.xAxes.push(xAxisBottom);

            (xAxisBottom.dataFields as ICategoryAxisDataFields).category = categoryColName;

            xAxisTop = new am4charts.CategoryAxis();

            chart.xAxes.push(xAxisTop);

            (xAxisTop.dataFields as ICategoryAxisDataFields).category = categoryColName;

            break;
    }

    initLine(xAxisBottom);
    initTicks(xAxisBottom);

    xAxisBottom.renderer.ticks.template.dy = -10;

    xAxisBottom.renderer.grid.template.config = {
        stroke: am4core.color("blue").lighten(0.5),
        strokeWidth: 1,
        strokeOpacity: 0.3
    }

    xAxisTop.renderer.opposite = true;
    // xAxisTop.renderer.labels.template.disabled = true;

    initLine(xAxisTop);
    initTicks(xAxisTop);

    xAxisTop.renderer.ticks.template.dy = 10;

    // ********************************************************************************

    const valueAxisLeft = new am4charts.ValueAxis();

    chart.yAxes.push(valueAxisLeft);

    initLine(valueAxisLeft);
    initTicks(valueAxisLeft);

    valueAxisLeft.renderer.ticks.template.dx = 10;

    valueAxisLeft.renderer.grid.template.config = {
        stroke: am4core.color("blue").lighten(0.5),
        strokeWidth: 1,
        strokeOpacity: 0.3
    }

    const valueAxisRight = new am4charts.ValueAxis();

    chart.yAxes.push(valueAxisRight);

    valueAxisRight.renderer.opposite = true;

    toggleOppositeAxes(chart, false);

    initLine(valueAxisRight);
    initTicks(valueAxisRight);

    valueAxisRight.renderer.ticks.template.dx = -10;
}

function initSeries(
    chart: XYChart,
    xAxisType: X_AXIS_TYPE
): LineSeries {

    const series = chart.series.push(new am4charts.LineSeries());

    switch (xAxisType) {

        case X_AXIS_TYPE.numbers:

            series.dataFields.valueX = xColName;
            // series.tooltipText = "{valueX}, {valueY}";
            break;

        case X_AXIS_TYPE.dates:

            series.dataFields.dateX = dateColName;
            // series.tooltipText = "{dateX}, {valueY}";
            break;

        case X_AXIS_TYPE.categories:

            series.dataFields.categoryX = categoryColName
            break;
    }
    series.dataFields.valueY = yColName;

    series.stroke = am4core.color("black").lighten(0.3);
    series.fill = am4core.color("blue");
    series.fillOpacity = 0.2;
    series.strokeWidth = 1;

    series.showOnInit = false;

    series.name = "O2 PES";

    return series;
}

function initCursor(
    chart: XYChart,
    mousePointerVisible: boolean
): void {

    const series = <XYSeries>chart.series.getIndex(0);

    chart.cursor = new am4charts.XYCursor();

    const config = {
        stroke: am4core.color("#8F3985"),
        strokeWidth: 2,
        strokeOpacity: 0.8,
        strokeDasharray: ""
    };
    chart.cursor.lineX.config = config;
    chart.cursor.lineY.config = config;

    if (mousePointerVisible) {

        chart.cursorOverStyle = am4core.MouseCursorStyle.default;
        chart.cursor.snapToSeries = series;

    } else {

        chart.cursorOverStyle = [
            {
                property: "cursor",

                value: "none",
            },
        ];
    }

    // chart.cursor.xAxis = xAxisBottom;
}

function toggleOppositeAxes(
    chart: XYChart,
    flag: boolean
): void {

    const xAxOpp = chart.xAxes.getIndex(1);
    const yAxOpp = chart.yAxes.getIndex(1);

    if (xAxOpp) {

        xAxOpp.renderer.disabled = !flag;
    }
    if (yAxOpp) {

        yAxOpp.renderer.disabled = !flag;
    }
}

// *************************************************************

function initChart(
    idx: number,
    id: string,
    data: any,
    xAxisType: X_AXIS_TYPE
) {
    const chart = am4core.create(id, am4charts.XYChart);

    chart.data = data;

    initAxes(chart, xAxisType);

    const series = initSeries(chart, xAxisType);

    initToolTips(series);

    initBullets(series);

    initCursor(chart, false);

    initScrollbar(chart, series);

    chart.numberFormatter.numberFormat = "#,###.##";

    chart.plotContainer.config = {
        stroke: am4core.color("#2762fc"),
        strokeWidth: 2,
        strokeOpacity: 0.25
    }
    chart.plotContainer.background.config = {
        fill: am4core.color('white'),
        fillOpacity: 1
    }
    return chart;
}

// ****************************************************************

initData();

// *********************************************************

const zoomTo = (
    start: number,
    end: number
) => {
    charts.forEach((chart) => {
        chart.xAxes.values.forEach((xAx) => {
            // xAx.zoomToValues(
            //   200,
            //   300
            // );
            // xAx.zoomToIndexes(
            //   start,
            //   end
            // );
            xAx.zoom({
                start: start,
                end: end,
            });
        });
    });
};

// *********************************************************
