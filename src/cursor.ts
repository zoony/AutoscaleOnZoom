import {
    XYChart,
    XYCursor,
    XYSeries
} from '@amcharts/amcharts4/charts';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';

// **********************************************************************

export function initCursor(
    mousePointerVisible: boolean
): XYCursor {

    const cursor = new am4charts.XYCursor();

    const config = {
        stroke: am4core.color("#8F3985"),
        strokeWidth: 2,
        strokeOpacity: 0.8,
        strokeDasharray: ""
    };
    cursor.lineX.config = config;
    cursor.lineY.config = config;

    return cursor;
}

// **********************************************************************

export function setCursorConfig(
    chart: XYChart,
    mousePointerVisible: boolean
) {
    const cursorNone = [
        {
            property: "cursor",

            value: "none",
        },
    ];
    const cursorDef = am4core.MouseCursorStyle.default;

    let series: XYSeries;

    if (mousePointerVisible) {

        series = <XYSeries>chart.series.getIndex(0);
        chart.cursor.snapToSeries = series;

        // chart.cursorOverStyle = cursorDef;

    } else {

        // chart.cursorOverStyle = cursorNone;

        chart.cursor.snapToSeries = [];
    }

}

// **********************************************************************
