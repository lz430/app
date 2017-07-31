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
                    const className =
                        this.props.selectedTransmissionType === transmissionType
                            ? 'filter-selector__radio filter-selector__radio--selected'
                            : 'filter-selector__radio';

                    return (
                        <div
                            key={index}
                            className="filter-selector__selector"
                            onClick={this.props.onSelectTransmissionType.bind(
                                null,
                                transmissionType
                            )}
                        >
                            <div className={className} /> {transmissionType}
                        </div>
                    );
                })}
            </div>
        );
    }
}

FilterTransmissionTypeSelector.propTypes = {
    transmissionTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedTransmissionType: PropTypes.oneOf(['automatic', 'manual']),
    onSelectTransmissionType: PropTypes.func.isRequired,
};

export default FilterTransmissionTypeSelector;
