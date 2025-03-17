import React, { useLayoutEffect, useState } from 'react'
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function Chart({chartData, settings}) {
    const chartID = useState(`chart-${Math.random().toString(36).slice(2, 9)}`);
    useLayoutEffect(() => {

        var rendrer =  {
            grid: {
                template: {
                    visible: false 
                }
            }
        }

        var rotation = {
            fontSize:12
        }

        if(settings){
            rendrer =  {
                minGridDistance: 10,
            }
            rotation = {
                rotation: -45, 
                centerY: am5.p50,
                centerX: am5.p100,
                paddingRight: 10, 
                fontSize:12
            }
        }
        

        let root = am5.Root.new(chartID);
        root.setThemes([am5themes_Animated.new(root)]);
    
        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: true,
                panY: true,
            })
        );
    
        let xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
                categoryField: "category",
                renderer: am5xy.AxisRendererX.new(root, rendrer),
                
            })
        );
    
        xAxis.data.setAll(chartData);

        xAxis.get("renderer").labels.template.setAll(rotation);

        let yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                min: 0,
                strictMinMax: true,
                renderer: am5xy.AxisRendererY.new(root, {
                    minGridDistance: 30,
                    grid: {
                        template: {
                            visible: false 
                        }
                    }
                }),
            })
        );

        
    
        yAxis.children.unshift(
            am5.Label.new(root, {
                rotation: -90, 
                text: "Jumpers",
                y: am5.p50,
                centerX: am5.p50, 
                fontSize: 20,
                fontWeight: "500",
                fill: am5.color("#000"),
            })
        );
    
        yAxis.get("renderer").labels.template.setAll({
            fontSize: 14,
        });
        yAxis.set("numberFormat", "#");

        let series1 = chart.series.push(
            am5xy.ColumnSeries.new(root, {
                name: "Actual",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "value1",
                categoryXField: "category",
                clustered: false, 
                fill: am5.color("#2c53e3"),
                strokeWidth: 0,
            })
        );
    
        series1.columns.template.setAll({
            width: am5.percent(70), 
            tooltipText: "{category}: \nActual: {valueY}",
            fillOpacity: 0.9, 
        });
    
        series1.data.setAll(chartData);
        let series2 = chart.series.push(
            am5xy.ColumnSeries.new(root, {
                name: "Predicted",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "value2",
                categoryXField: "category",
                clustered: false,
                fill: am5.color("#00b716"),
                strokeWidth: 0,
            })
        );
    
        series2.columns.template.setAll({
            width: am5.percent(50),
            tooltipText: "{category}: \nPredicted: {valueY}",
            fillOpacity: 0.7, 
        });
    
        series2.data.setAll(chartData);
    
        return () => {
            root.dispose();
        };
    }, [chartData, chartID, settings]);
  return (
    <div id={`${chartID}`} style={{ position:'relative',textAlign:'left',width: "100%", height: "250px" }}></div>
  )
}
