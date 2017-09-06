import React from "react";
import PropTypes from "prop-types";
import R from "ramda";
import SVGInline from "react-svg-inline";
import zondicons from "zondicons";

class FilterFuelTypeSelector extends React.PureComponent {
  render() {
    return (
      <div className="filter-selector">
        {this.props.fuelTypes.map((fuelType, index) => {
          const className = this.props.selectedFuelType === fuelType
            ? "filter-selector__radio filter-selector__radio--selected"
            : "filter-selector__radio";

          return (
            <div
              key={index}
              className="filter-selector__selector"
              onClick={this.props.onChooseFuelType.bind(null, fuelType)}
            >
              <div className={className} /> {fuelType}
            </div>
          );
        })}
      </div>
    );
  }
}

FilterFuelTypeSelector.propTypes = {
  fuelTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedFuelType: PropTypes.string,
  onChooseFuelType: PropTypes.func.isRequired
};

export default FilterFuelTypeSelector;
