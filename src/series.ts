import {X_AXIS_TYPE} from './axes';
import {
    CircleBullet,
    LineSeries
} from '@amcharts/amcharts4/charts';

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';

// **********************************************************************

const xColName = "channel";
const dateColName = "date";
const categoryColName = "category";
const yColName = "y";

// **********************************************************************

export function initSeries(
    xAxisType: X_AXIS_TYPE,
    autoscaleFlag: boolean
): LineSeries {

    const series = new am4charts.LineSeries();

    switch (xAxisType) {

        case X_AXIS_TYPE.numbers:

            series.dataFields.valueX = xColName;
            break;

        case X_AXIS_TYPE.dates:

            series.dataFields.dateX = dateColName;
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

    if (autoscaleFlag) {

        series.events.enableType("selectionextremeschanged");

    } else {

        series.events.disableType("selectionextremeschanged");
    }

    series.showOnInit = false;

    series.name = "O2 PES";

    return series;
}

// **********************************************************************

export function initToolTips(
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

// **********************************************************************

export function initBullets(): CircleBullet {

    const bullet = new am4charts.CircleBullet();
    bullet.circle.config = {
        // fill: am4core.color("#00f"),
        // fillOpacity: 0.5,
        strokeWidth: 0,
        radius: 3
    }
    const bullethover = bullet.states.create("hover");
    bullethover.properties.scale = 3;

    return bullet;
}

// **********************************************************************



