import {
    ICategoryAxisDataFields,
    ValueAxis,
    XYChart
} from '@amcharts/amcharts4/charts';

import * as am4charts from '@amcharts/amcharts4/charts';
import {
    IDateAxisDataFields
} from '@amcharts/amcharts4/.internal/charts/axes/DateAxis';
import * as am4core from '@amcharts/amcharts4/core';

// **********************************************************************

export enum X_AXIS_TYPE {
    numbers,
    dates,
    categories
}
export interface IAxes{
    bottom: ValueAxis | am4charts.DateAxis | am4charts.CategoryAxis,
    top?: ValueAxis | am4charts.DateAxis | am4charts.CategoryAxis | null,
    left: ValueAxis,
    right?: ValueAxis | null
}

const xColName = "channel";
const dateColName = "date";
const categoryColName = "category";
const yColName = "y";

const axLine = {
    strokeOpacity: 1,
    strokeWidth: 2,
    stroke: am4core.color("#3787ac"),
};
const axTicks = {
    disabled: false,
    strokeOpacity: 1,
    stroke: am4core.color("#495C43"),
    strokeWidth: 3,
    length: 10,
};

// **********************************************************************

export function initAxes(
    xAxisType: X_AXIS_TYPE,
    oppFlag: boolean
): IAxes {

    let xAxisBottom: ValueAxis | am4charts.DateAxis | am4charts.CategoryAxis;
    let xAxisTop: ValueAxis | am4charts.DateAxis | am4charts.CategoryAxis | null;

    let valueAxisLeft: ValueAxis;
    let valueAxisRight: ValueAxis | null;

    xAxisTop = null;
    valueAxisRight = null;

    xAxisBottom = initXAxis(xAxisType);

    if (oppFlag) {
        xAxisTop = initXAxis(xAxisType);
    }

    valueAxisLeft = initYAxis();

    if (oppFlag) {

        valueAxisRight = initYAxis();
    }

    return {
        bottom: xAxisBottom,
        top: xAxisTop,
        left: valueAxisLeft,
        right: valueAxisRight
    };
}

// **********************************************************************

export function initXAxis(
    xAxisType: X_AXIS_TYPE
): ValueAxis | am4charts.DateAxis | am4charts.CategoryAxis {

    let axis: ValueAxis | am4charts.DateAxis | am4charts.CategoryAxis;

    switch (xAxisType) {

        case X_AXIS_TYPE.numbers:

            axis = new am4charts.ValueAxis();
            axis.dataFields.data = xColName;
            break;

        case X_AXIS_TYPE.dates:

            axis = new am4charts.DateAxis();
            (axis.dataFields as IDateAxisDataFields).date = dateColName;
            break;

        case X_AXIS_TYPE.categories:

            axis = new am4charts.CategoryAxis();
            (axis.dataFields as ICategoryAxisDataFields).category = categoryColName;
            break;
    }
    return axis;
}

// **********************************************************************

export function initYAxis(): ValueAxis {

    let axis: ValueAxis;

    axis = new am4charts.ValueAxis();

    axis.extraMax = 0;
    axis.extraMin = 0;

    // axis.strictMinMax = true;

    return axis;
}

// **********************************************************************

export function configureAxes(
    chart: XYChart,
    oppFlag: boolean
) {
    const ticksDelta = {
        x: {
            bottom: -10,
            top: 10
        },
        y: {
            left: 10,
            right: -10
        }
    }

    let axes;

    if (oppFlag) {

        axes = {
            x: {
                bottom: chart.xAxes.getIndex(0),
                top: chart.xAxes.getIndex(1)
            },
            y: {
                left: chart.yAxes.getIndex(0),
                right: chart.yAxes.getIndex(1)
            }
        }
    } else {

        axes = {
            x: {
                bottom: chart.xAxes.getIndex(0)
            },
            y: {
                left: chart.yAxes.getIndex(0)
            }
        }
    }

    for (const [axType, axObj] of Object.entries(axes)) {

        for (const [loc, ax] of Object.entries(axObj)) {

            // @ts-ignore
            const r = ax.renderer;

            r.line.config = axLine;
            r.ticks.template.config = axTicks;

            if (loc === 'left' ||
                loc === 'bottom') {

                r.grid.template.config = {
                    stroke: am4core.color("blue").lighten(0.5),
                    strokeWidth: 1,
                    strokeOpacity: 0.3
                }
            }
            if (loc === 'right' ||
                loc === 'top') {

                r.opposite = true;
                // r.labels.template.disabled = true;
            }
            if (loc === 'left' ||
                loc === 'right') {

                // @ts-ignore
                r.ticks.template.dx = ticksDelta[axType][loc];
            }
            if (loc === 'bottom' ||
                loc === 'top') {

                // @ts-ignore
                r.ticks.template.dy = ticksDelta[axType][loc];
            }
        }
    }
}

// **********************************************************************

export function addOppositeAxes(
    chart: XYChart,
    xAxisType: X_AXIS_TYPE
): void {

    let xAxis: ValueAxis | am4charts.DateAxis | am4charts.CategoryAxis;
    let yAxis: ValueAxis;

    if (chart.xAxes.length === 1) {

        xAxis = initXAxis(xAxisType);
        yAxis = initYAxis();

        chart.xAxes.push(xAxis);
        chart.yAxes.push(yAxis);

        configureAxes(chart, true);
    }
}

// **********************************************************************

export function removeOppositeAxes(
    chart: XYChart
): void {

    if (chart.xAxes.getIndex(1)) {

        chart.xAxes.removeIndex(1);
    }
    if (chart.yAxes.getIndex(1)) {

        chart.yAxes.removeIndex(1);
    }
}

// **********************************************************************

export function toggleOppositeAxes(
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

// **********************************************************************

