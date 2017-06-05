import React from 'react';
import ReactDOM from 'react-dom';

class FormGroup extends React.Component {
    constructor(props){
        super(props);
    }    

    render(){
        return(
            <div className="form-group">
                <div className="col-sm-9">
                    <label htmlFor={this.props.name}>{this.props.label}</label>
                </div>
                <div className="col-sm-3">
                    <input type={this.props.type||"text"} className="form-control" name={this.props.name} 
                        placeholder={this.props.label} defaultValue={this.props.value}
                        ref={(input) => this.input = input} />
                </div>
            </div>
        )
    }
}

export default class InquiryForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    drawDeviationChart(deviation, value){
        Highcharts.chart('deviationChart', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Poikkeavin arvo'
            },
            yAxis: {
                min: -4, 
                max: 4
            },
            xAxis: {
                categories: [deviation]
            },
            credits: {
                enabled: false
            },
            series: [{
                name: deviation,
                data: [value]
            }]
        });
    }

    drawGauge(value){
        let gaugeOptions = {
            chart: {
                type: 'solidgauge',
                height: 300
            },
            pane: {
                center: ['50%', '85%'],
                // size: '100%',
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
            },
            tooltip: {
                enabled: false
            },
            yAxis: {
                stops: [
                    [0.1, '#55BF3B'], // green
                    [0.5, '#DDDF0D'], // yellow
                    [0.75, '#DF5353'] // red
                ],
                lineWidth: 0,
                minorTickInterval: null,
                tickAmount: 2,
                title: {
                    y: -70
                },
                labels: {
                    y: 16
                }
            },
            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        y: 5,
                        borderWidth: 0,
                        useHTML: true
                    }
                }
            }
        };      

        let chartSpeed = Highcharts.chart('riskGauge', Highcharts.merge(gaugeOptions, {
            yAxis: {
                min: 0,
                max: 100
            },
            title: "Riskiluokitus",
            credits: {
                enabled: false
            },
            series: [{
                name: 'Riskiluokitus',
                data: [value],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                        ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                        '</div>'
                }
            }]
        }));
    }

    handleSubmit(event){
        var self = this;
        event.preventDefault();
        var formData = $("#inquiryForm").serializeArray();
        var req = {
            "tablename":"User Input",
            "header": [],
            "data": []
        };
        for(var field of formData){
            req.header.push(field.name);
            req.data.push(field.value);
        }
        req.data = [req.data]; // oddly data is an array inside array
        let str = JSON.stringify(req);

        $.ajax({
            url: "http://localhost:5000/", //"https://mkk2api.azurewebsites.net",//,
            type: "POST",
            data: str,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: (responseData, status, xhr)=> {
                console.log("received: "+responseData);
                var data = responseData[0].data[0];
                var riskPercent = (data[2]*100);
                self.setState({riskLevel: riskPercent.toFixed(2), pattern: data[3], poikkeavinArvo: data[4], poikkeamanSuuruus: data[5]})
                self.drawGauge(riskPercent);
                self.drawDeviationChart(this.state.poikkeavinArvo, this.state.poikkeamanSuuruus);
            }});
    }
    
    render() {
        return (
            <div>
                <div className="col-md-6">
                    <h3>Syötemuuttujat</h3>
                    <form id="inquiryForm" onSubmit={this.handleSubmit} className="form-horizontal" role="form">
                        <FormGroup label="Kansalaisuus" name="Kansalaisuus" value="Suomi" />
                        <FormGroup label="Henkilötunnus" name="Henkilötunnus" value="Matti" />
                        <FormGroup label="Yhdessä koulussa vietetty aika keskim. (vuosia)" name="AVG_TIMEPERSCHOOL" value="2" />
                        <FormGroup label="Aika vanhemman viimeisestä Wilma-kirjautumisesta (kk)" name="TIMESINCE_LOGIN" value="2" />
                        <FormGroup label="Saanut lisäopetusta?" name="LISAOPETUS" value="0" />
                        <FormGroup label="Koulujen määrä" name="NROF_SCHOOLS" value="2" />
                        <FormGroup label="7.lk keskiarvo" name="7LK_KESKIARVO" value="8.5" />
                        <FormGroup label="7.lk opintoviikkoja" name="7LK_OPINTOVIIKKOJA" value="14" />
                        <FormGroup label="7.lk äidinkieli" name="7LK_ÄIDINKIELI" value="9" />
                        <FormGroup label="7.lk liikunta" name="7LK_LIIKUNTA" value="8" />
                        <FormGroup label="7.lk matematiikka" name="7LK_MATEMATIIKKA" value="6" />
                        <FormGroup label="7.lk taideaineet" name="7LK_TAIDEAINEET" value="9" />
                        <FormGroup label="7.lk käytös" name="7LK_KAYTOS" value="9" />
                        <FormGroup label="Keskiarvon muutos" name="KA_MUUTOS" value="0" />
                        <input type="submit" value="Submit" />
                    </form>
                </div>
                <div className="col-md-6">
                    <h3>Vastaus</h3>
                    <div>Riskiluokitus: {this.state.riskLevel}</div>
                    <div>Pattern: {this.state.pattern}</div>
                    <div>Poikkeavin arvo: {this.state.poikkeavinArvo}</div>
                    <div>Poikkeaman suuruus: {this.state.poikkeamanSuuruus}</div>
                    <div id="riskGauge"></div>
                    <div id="deviationChart"></div>
                </div>
            </div>
        );
    }
}