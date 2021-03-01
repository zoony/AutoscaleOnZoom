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
    if (mousePointerVisible) {

        const series = <XYSeries>chart.series.getIndex(0);

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
}

// **********************************************************************
