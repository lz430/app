import React from 'react';
import PropTypes from 'prop-types';
import AccordionTable from './AccordionTable';
import EquipmentList from './EquipmentList';
class EquipmentCategory extends React.PureComponent {
    static propTypes = {
        cols: PropTypes.array.isRequired,
        category: PropTypes.string.isRequired,
    };

    renderFeature(colIndex, equipmentIndex, category) {
        return (
            <div className="compare-feature">
                {
                    this.props.cols[colIndex]['equipment'][category][
                        equipmentIndex
                    ]
                }
            </div>
        );
    }
    renderFeatureRow(category, equipmentIndex) {
        return (
            <div className="compare-feature-row">
                {this.props.cols.map((col, colIndex) => {
                    return this.renderFeature(
                        colIndex,
                        equipmentIndex,
                        category
                    );
                })}
            </div>
        );
    }

    render() {
        if (!this.props.category) {
            return false;
        }

        return (
            <div>
                <AccordionTable header={this.props.category}>
                    {this.props.cols[0].equipment[this.props.category].map(
                        (equipment, index) => {
                            return this.renderFeatureRow(
                                this.props.category,
                                index
                            );
                        }
                    )}
                    {/*this.props.cols.map((col, index) => {
                        return (
                            <EquipmentList
                                key={index}
                                col={col}
                                category={this.props.category}
                            />
                        );
                    } ) */}
                </AccordionTable>
            </div>
        );
    }
}

export default EquipmentCategory;
