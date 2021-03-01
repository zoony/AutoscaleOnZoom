
import {
    LineSeries,
    XYChartScrollbar
} from '@amcharts/amcharts4/charts';

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import {ResizeButton} from '@amcharts/amcharts4/core';

// **********************************************************************

export function initScrollbar(
    series: LineSeries
): XYChartScrollbar {

    const sb = new am4charts.XYChartScrollbar();
    sb.series.push(series);

    sb.scrollbarChart.plotContainer.filters.clear();
    sb.cursorOverStyle = am4core.MouseCursorStyle.default;

    sb.background.config = {
        stroke: am4core.color("blue").lighten(0.5),
        strokeOpacity: 0.2,
        fill: am4core.color("white"),
        fillOpacity: 0
    }
    sb.unselectedOverlay.disabled = true;

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

    return sb;
}

// **********************************************************************

export function customizeGrip(
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
    img.align = "center";
    img.valign = "middle";
}


