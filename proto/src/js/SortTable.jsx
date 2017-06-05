import React from 'react';
import ReactDOM from 'react-dom';

export default class SortTable extends React.Component {

  handleBtnClick() {
    if (order === 'desc') {
      this.refs.table.handleSort('asc', 'name');
      order = 'asc';
    } else {
      this.refs.table.handleSort('desc', 'name');
      order = 'desc';
    }
  }

  render() {

  	let koulut = [{
	  name: "Nimi 1",
	  number: "23",
	  nchange: "+5%",
	  dynamic: "10%",
	  dchange: "+5%",
	  money: "60",
	  reason: "Matematiikka"
	}, {
	  name: "Nimi 2",
	  number: "4",
	  nchange: "+10%",
	  dynamic: "50%",
	  dchange: "-15%",
	  money: "5",
	  reason: "Poissaolot"
	}, {
	  name: "Nimi 3",
	  number: "50",
	  nchange: "-15%",
	  dynamic: "80%",
	  dchange: "+23%",
	  money: "99",
	  reason: "Keskiarvo, Liikunta"
	}, {
	  name: "Nimi 4",
	  number: "3",
	  nchange: "+20%",
	  dynamic: "20%",
	  dchange: "-20%",
	  money: "68",
	  reason: "Liikunta"
	}];

    return (
      <div>
        <BootstrapTable ref='table' data={ koulut }>
              <TableHeaderColumn dataField='name' isKey={ true } dataSort={ true }>Nimi</TableHeaderColumn>
              <TableHeaderColumn dataField='number' dataSort={ true } hover>Määrä</TableHeaderColumn>
              <TableHeaderColumn dataField='nchange' dataSort={ true }>Kehitys</TableHeaderColumn>
              <TableHeaderColumn dataField='dynamic' dataSort={ true }>Ratkaisu%</TableHeaderColumn>
              <TableHeaderColumn dataField='dchange' dataSort={ true }>Kehitys</TableHeaderColumn>
              <TableHeaderColumn dataField='money' dataSort={ true }>Vaikuttavuus</TableHeaderColumn>
              <TableHeaderColumn dataField='reason' dataSort={ true }>Syyt</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }

}