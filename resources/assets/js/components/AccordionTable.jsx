import React from 'react';

class AccordionTable extends React.PureComponent {
    render() {
        return (
            <div className="compare-page-table__accordion">
                {this.props.children()}
            </div>
        );
    }
}

export default AccordionTable;
