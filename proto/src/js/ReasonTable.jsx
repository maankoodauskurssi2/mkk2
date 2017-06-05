import React from 'react';
import ReactDOM from 'react-dom';

export default class ReasonTable extends React.Component {

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

  	let syyt = [{
	  name: "48040",
	  reason: "Matematiikka"
	}, {
	  name: "44847",
	  reason: "Ei välivuosia, Keskiarvo > 6,43, Ei kaksoistutkinto, Liikunnan arvosana <=8"
	}, {
	  name: "9340",
	  reason: "Keskiarvo, Liikunta"
	}, {
	  name: "50234",
	  reason: "Liikunta"
	}];

    return (
      <div>
        <BootstrapTable ref='table' data={ syyt }>
              <TableHeaderColumn dataField='name' dataSort={ true }>Oppilaiden lukumäärä</TableHeaderColumn>
              <TableHeaderColumn dataField='reason' isKey={ true } dataSort={ true } hover>Arvion taustalla olevat syyt</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }

}