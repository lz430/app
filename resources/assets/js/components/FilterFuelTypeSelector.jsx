import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';

class FilterFuelTypeSelector extends React.Component {
    render() {
        return (
            <div className="filter-selector">
                {this.props.fuelTypes.map((fuelType, index) => {
                    return (
                        <div
                            key={index}
                            className="filter-selector__selector"
                            onClick={this.props.onSelectFuelType.bind(
                                null,
                                fuelType
                            )}
                        >
                            {R.contains(fuelType, this.props.selectedFuelTypes)
                                ? <SVGInline
                                      width="15px"
                                      className="filter-selector__checkbox"
                                      svg={zondicons['checkmark']}
                                  />
                                : ''}
                            {' '}
                            {fuelType}
                        </div>
                    );
                })}
            </div>
        );
    }
}

FilterFuelTypeSelector.propTypes = {
    fuelTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedFuelTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelectFuelType: PropTypes.func.isRequired,
};

export default FilterFuelTypeSelector;
