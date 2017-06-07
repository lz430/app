import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';

class FilterTransmissionTypeSelector extends React.Component {
    render() {
        return (
            <div className="filter-selector">
                {this.props.transmissionTypes.map((transmissionType, index) => {
                    return (
                        <div
                            key={index}
                            className="filter-selector__selector"
                            onClick={this.props.onSelectTransmissionType.bind(null, transmissionType)}
                        >
                            {transmissionType === this.props.selectedTransmissionType
                                 ? <div
                                      className="filter-selector__radio"
                                >radio</div>
                                : ''
                            } {transmissionType}
                        </div>
                    );
                })}
            </div>
        );
    }
}

FilterTransmissionTypeSelector.propTypes = {
    transmissionTypes: PropTypes.arrayOf(
        PropTypes.string,
    ).isRequired,
    selectedTransmissionType: PropTypes.oneOf([
        'automatic',
        'manual',
    ]),
    onSelectTransmissionType: PropTypes.func.isRequired,
};

export default FilterTransmissionTypeSelector;
