
import "./style.css"; // webpack will handing this loading...

// **********************************************************************

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_animated from '@amcharts/amcharts4/themes/animated';

import amch from '../node_modules/@amcharts/amcharts4/package.json';

// am4core.useTheme(am4themes_animated);

// *****************************************************

import * as aonz_data from "./data";
import * as aonz_axes from "./axes";
import * as aonz_series from "./series";
import * as aonz_cursor from "./cursor";
import * as aonz_scrollbar from "./scrollbar";

// **********************************************************************

let charts: am4charts.XYChart[] = [];
let demoData: aonz_data.IDataPoint[] = [];

let oppFlag = false;

const dVer = document.getElementById("dVer")!;

dVer.innerHTML = `amCharts v${amch.version}`;

document.getElementById("btn1")!.addEventListener("click", () => {

    zoomTo(240 / 800, 3 / 8);
});

document.getElementById("btn2")!.addEventListener("click", () => {

    zoomTo(0, 1);
});

document.getElementById("yMinGaps")!.addEventListener("change", (evt: any) => {

    let negFlag = false;
    let negVal = 0.0;

    if (evt.target.value &&
        evt.target.value != '') {

        negFlag = true;
        negVal = parseFloat(evt.target.value);
    }

    demoData = aonz_data.initDemoData(negFlag, negVal);

    charts[0].data = demoData;
    charts[1].data = demoData;
    charts[2].data = demoData;
});

document.getElementById("cursorSnap")!.addEventListener("change", (evt: any) => {

    const snapFlag = evt.target.checked;

    aonz_cursor.setCursorConfig(charts[0], snapFlag);
    aonz_cursor.setCursorConfig(charts[1], snapFlag);
    aonz_cursor.setCursorConfig(charts[2], snapFlag);
});

const cbOppAxes = <HTMLInputElement>document.getElementById("oppositeAxes")!;

cbOppAxes.checked = oppFlag;

cbOppAxes.addEventListener("change", (evt: any) => {

    oppFlag = evt.target.checked;

    const axTypes = [
        aonz_axes.X_AXIS_TYPE.numbers,
        aonz_axes.X_AXIS_TYPE.dates,
        aonz_axes.X_AXIS_TYPE.categories
    ];

    // charts.forEach((chart, idx) => {
    //
    //     if (oppFlag) {
    //
    //         aonz_axes.addOppositeAxes(chart, axTypes[idx]);
    //
    //     } else {
    //
    //         aonz_axes.removeOppositeAxes(chart);
    //     }
    // });
    initCharts();
});

// *********************************************************

function initChart(
    idx: number,
    id: string,
    data: any,
    xAxisType: aonz_axes.X_AXIS_TYPE
) {
    const chart = am4core.create(id, am4charts.XYChart);

    chart.data = data;

    const axes = aonz_axes.initAxes(xAxisType, oppFlag);

    chart.xAxes.push(axes.bottom);
    chart.yAxes.push(axes.left);

    if (oppFlag) {

        // @ts-ignore
        chart.xAxes.push(axes.top);
        // @ts-ignore
        chart.yAxes.push(axes.right);
    }

    aonz_axes.configureAxes(chart, oppFlag);

    const series = aonz_series.initSeries(xAxisType);
    chart.series.push(series);

    aonz_series.initToolTips(series);

    const bullets = aonz_series.initBullets();
    series.bullets.push(bullets);
    series.minBulletDistance = 8;

    chart.cursor = aonz_cursor.initCursor(false);
    aonz_cursor.setCursorConfig(chart, false);

    chart.scrollbarX = aonz_scrollbar.initScrollbar(series);

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

const zoomTo = (
    start: number,
    end: number
) => {
    charts.forEach((chart) => {
        chart.xAxes.values.forEach((xAx) => {
            xAx.zoom({
                start: start,
                end: end,
            });
        });
    });
};

// ****************************************************************

aonz_data.initData()
    .then(
        (data) => {

            demoData = data;

            initCharts();
        },
        (error) => {

            console.log(error.message)
        }
    )

function initCharts() {

    if (charts.length) {

        am4core.disposeAllCharts();
    }
    charts.length = 0;

    charts.push(initChart(0, "chartdiv1", demoData, aonz_axes.X_AXIS_TYPE.numbers));
    charts.push(initChart(1, "chartdiv2", demoData, aonz_axes.X_AXIS_TYPE.dates));
    charts.push(initChart(2, "chartdiv3", demoData, aonz_axes.X_AXIS_TYPE.categories));
}
