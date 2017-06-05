import React from 'react';
import ReactDOM from 'react-dom';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import InquiryForm from './InquiryForm.jsx';
import SortTable from './SortTable.jsx';
import ReasonTable from './ReasonTable.jsx';

let order = 'desc';

$(function () {

    function getFillColorNegative(value){
        var opacity = 0.5 + (value % 50)/100;
        return "rgba(206, 8, 8, "+opacity+")";
    }

    function getFillColorPositive(value){
        var opacity = 0.5 + (value % 50)/100;
        return "rgba(95, 229, 68, "+opacity+")";
    }

    function calcFillColor(value){
        var opacity = 0.5 + (value % 50)/100;
        if(value % 10 < 4)
            return "rgba(206, 8, 8, "+opacity+")";
        else
            return "rgba(95, 229, 68, "+opacity+")";
    }

    function calcFillColor2(value){
        var opacity = 0.5 + (value % 50)/100;
        if((value * 3) % 10 < 3)
            return "rgba(206, 8, 8, "+opacity+")";
        else
            return "rgba(95, 229, 68, "+opacity+")";
    }

    function calcFillColor3(value){
        var opacity = 0.5 + (value % 50)/100;
        if((value * 2) % 12 < 6)
            return "rgba(206, 8, 8, "+opacity+")";
        else
            return "rgba(95, 229, 68, "+opacity+")";
    }

    function getFillColor(dataElement, colorFunc){
        try {
            var value = dataElement.properties["Pinta-ala"];
            if (value !== undefined) {
                var valF = parseFloat(value.replace(",", ".").replace(" ", ""));
                return colorFunc(valF);
            } else {
                return "#cccccc";
            }
        } catch(ex){
            return "#cccccc";
        }
    }

    function getRandomFillColor(dataElement){
        return getFillColor(dataElement, calcFillColor);
    }

    function getRandomFillColor2(dataElement){
        return getFillColor(dataElement, calcFillColor2);
    }

    function getRandomFillColor3(dataElement){
        return getFillColor(dataElement, calcFillColor3);
    }

    function getPositiveFillColor(dataElement){
        return getFillColor(dataElement, getFillColorPositive);
    }    

    function loadMunicipalMap(targetElementId, fillColorFunc) {
        var width  = 200;
        var height = 400;

        var vis = d3.select("#"+targetElementId).append("svg")
            .attr("width", width).attr("height", height)

        d3.json("data/kunnat.geojson", function(json) {
            // create a first guess for the projection
            var center = [25.4, 65.3];
            var scale  = 150;
            var offset = [width/2, height/2];
            var projection = d3.geoMercator().scale(scale).center(center)
                .translate(offset);

            // create the path
            var path = d3.geoPath().projection(projection);

            // using the path determine the bounds of the current map and use 
            // these to determine better values for the scale and translation
            var bounds  = path.bounds(json);
            var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
            
            var boundsHeight = bounds[1][1] - bounds[0][1];
            var vmargin = boundsHeight * 0.05;
            var vscale  = scale*height / (boundsHeight + vmargin);
            var scale   = (hscale < vscale) ? hscale : vscale;
            var offset  = [width - (bounds[0][0] + bounds[1][0])/2,
                                height - (bounds[0][1] + bounds[1][1])/2];

            // new projection
            projection = d3.geoMercator().center(center)
                .scale(scale).translate(offset);
            path = path.projection(projection);

            vis.selectAll("path").data(json.features).enter().append("path")
                .attr("d", path)
                .style("fill", fillColorFunc)
                .style("stroke-width", "0.25")
                .style("stroke", "black")
            });
    };

    function loadRiskStudentNumberChart(targetElementId) {
        Highcharts.chart(targetElementId, {
            title: {
                text: 'Riskioppilaiden määrän kehitys'
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Määrä'
                },
                min: 0
            },

            series: [{
                name: 'Riskioppilaiden määrä',
                data: [9019, 9202, 9321, 9340, 9521, 9747, 9292, 9889, 10959]
            }]

        });
    }

    function loadRiskIndexChart(targetElementId) {
        Highcharts.chart(targetElementId, {
            title: {
                text: 'Riski-indeksin kehitys'
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Indeksi'
                },
                min: 0,
                max: 100
            },

            series: [{
                name: 'Riski-indeksi',
                data: [33, 35, 36, 40, 39, 38, 37, 39]
            }, 
            {
                name: 'Korkein',
                data: [67, 65, 67, 66, 65, 66, 67, 68],
                color: "#CCCCCC"
            },
            {
                name: 'Matalin',
                data: [10, 11, 12, 11, 10, 10, 10, 10],
                color: "#CCCCCC"
            }]

        });
    }

    function loadYearlyRiskStudentBarChart(targetElementId) {
        Highcharts.chart(targetElementId, {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Oppilaat vuosiluokittain'
            },
            xAxis: {
                categories: ['1.lk', '2.lk', '3.lk', '4.lk', '5.lk', '6.lk', '7.lk', '8.lk', '9.lk', '10.lk, Valma', '1v.', '2.v', '3.v']
            },
            yAxis: {
                title: {
                    text: 'Oppilaiden määrä'
                }
            },
            series: [{
                name: 'Oppilaiden määrä',
                data: [
                    3500, 4000, 3000, 5000, 9000, 10000, //1-6 lk
                    11000, 12000, 11240, // 7-9
                    11000, // 10lk/valma
                    12000, 12000, 11000 // 2. aste
                ],
                zoneAxis: 'x',
                zones: [{
                        value: 9,
                        color: '#7cb5ec'
                    }, {
                        value: 10,
                        color: '#90ed7d'
                    },
                    {
                        value: 13,
                        color: '#f7a35c'
                    }
                ],
            }]

        });
    }

    function loadRiskStudentMap(targetElementId) {
        loadMunicipalMap(targetElementId, getRandomFillColor)
    }

    function loadRiskStudentsTrendMap(targetElementId){
        loadMunicipalMap(targetElementId, getPositiveFillColor);
    }

    function loadDynamicRiskResolveRatioMap(targetElementId){
        loadMunicipalMap(targetElementId, getRandomFillColor2);
    }

    function loadDynamicRiskResolveRatioTrendMap(targetElementId){
        loadMunicipalMap(targetElementId, getRandomFillColor3);
    }

    if($("#mapRiskStudents").length > 0)
        loadRiskStudentMap('mapRiskStudents');
    
    if($("#mapRiskStudentsTrend").length > 0)
        loadRiskStudentsTrendMap('mapRiskStudentsTrend');
    
    if($("#mapDynamicRiskResolveRatio").length > 0)
        loadDynamicRiskResolveRatioMap('mapDynamicRiskResolveRatio');
    
    if($("#mapDynamicRiskResolveRatioTrend").length > 0)
        loadDynamicRiskResolveRatioTrendMap('mapDynamicRiskResolveRatioTrend');    
    
    if($("#riskIndexChart").length > 0)
        loadRiskIndexChart('riskIndexChart');
    
    if($("#riskStudentNumberChart").length > 0)
        loadRiskStudentNumberChart('riskStudentNumberChart');
    
    if($("#riskStudentsBarChart").length > 0)
        loadYearlyRiskStudentBarChart('riskStudentsBarChart');    
});

var products = [{
      id: 1,
      name: "Product1",
      price: 120
  }, {
      id: 2,
      name: "Product2",
      price: 80
  }];

if($("#table").length > 0){
    ReactDOM.render(
        <SortTable/>,
    document.getElementById('table')
    );
}
if($("#reasontable").length > 0){
    ReactDOM.render(
        <ReasonTable/>,
    document.getElementById('reasontable')
    );
}

if($("#testInquiryForm").length > 0){
    ReactDOM.render(
        <div className="row">
            <div className="col-md-12">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Syrjäytymisen ennustemalli</h3>
                    </div>
                    <div className="panel-body">
                        <InquiryForm />
                    </div>
                </div>
            </div>       
        </div>,
    document.getElementById('testInquiryForm')
    );
}