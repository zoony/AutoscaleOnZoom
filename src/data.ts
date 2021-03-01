import * as am4core from '@amcharts/amcharts4/core';
import {ICSVOptions} from '@amcharts/amcharts4/core';

// **********************************************************************

let rawData: any[] = [];

export let xMin = 1e6;
export let xMax = -1e6;
export let yMin = 1e6;
export let yMax = -1e6;

export interface IDataPoint {
    channel: Number,
    x: Number,
    y: Number,
    date: Date,
    category: string
}

// **********************************************************************

export function initData() {

    return new Promise<IDataPoint[]>((resolve, reject) => {

        const dataSource = new am4core.DataSource();

        dataSource.url = "https://raw.githubusercontent.com/zoony/AutoscaleOnZoom/master/dist/testData.csv";
        dataSource.parser = new am4core.CSVParser();

        (dataSource.parser.options as ICSVOptions).useColumnNames = true; // ************************************

        dataSource.load();
        dataSource.events.on("done", function (ev) {
            // Data loaded and parsed

            rawData = ev.target.data;

            xMin = 0;
            xMax = rawData.length - 1;

            resolve(initDemoData());
        });
        dataSource.events.on("error", function (ev) {

            reject(new Error(`Oopsy! Something went wrong loading the data file [${ev.message}]`));
        });
    });
}

// *********************************************************

export function initDemoData(
    negFlag?: boolean,
    negVal?: number
): IDataPoint[] {

    const firstDate = new Date();

    yMin = 1e6;
    yMax = -1e6;

    rawData.forEach((row) => {

        const y = parseFloat(row.y);

        if (y > yMax) {
            yMax = y;
        }
        if (y < yMin) {
            yMin = y;
        }
    });
    const demoData = rawData.map((row, index) => {

        const x = parseFloat(row.x);
        const y = parseFloat(row.y);

        const newDate = new Date(firstDate);
        newDate.setDate(newDate.getDate() + index);

        const yVal = (negFlag && negVal != undefined && y < 0) ? negVal * yMax : y;

        return {
            channel: index,
            x: x,
            y: yVal,
            date: newDate,
            category: index.toString()
        };
    });

    if (negFlag &&
        negVal != undefined &&
        yMin < 0) {

        yMin = negVal * yMax;
        // yMin = 0;
    }
    let s = `Data: x[${xMin} => ${xMax}] `;
    const yMinStr =
        yMin < 0
            ? `<span class='neg-val'>${yMin.toFixed(1)}</span>`
            : yMin.toFixed(1);
    s += `y[${yMinStr} => ${yMax.toFixed(1)}]`;

    const dInfo = document.getElementById("dInfo")!;
    dInfo.innerHTML = s;

    return demoData;
}

// **********************************************************************
