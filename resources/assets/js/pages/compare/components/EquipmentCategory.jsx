import React from 'react';
import PropTypes from 'prop-types';
import AccordionTable from './AccordionTable';
import EquipmentList from './EquipmentList';
class EquipmentCategory extends React.PureComponent {
    static propTypes = {
        cols: PropTypes.array.isRequired,
        category: PropTypes.string.isRequired,
    };

    render() {
        return (
            <div>
                <AccordionTable header={this.props.category}>
                    {this.props.cols.map((col, index) => {
                        return (
                            <EquipmentList
                                key={index}
                                col={col}
                                category={this.props.category}
                            />
                        );
                    })}
                </AccordionTable>
            </div>
        );
    }
}

export default EquipmentCategory;
