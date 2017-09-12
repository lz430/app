import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import R from 'ramda';
import { connect } from 'react-redux';
import * as Actions from 'actions';

class Filterbar extends React.PureComponent {
    constructor(props) {
        super(props);

        this.renderFilterStyles = this.renderFilterStyles.bind(this);
        this.renderFilterMakes = this.renderFilterMakes.bind(this);
        this.renderFilterTransmissionType = this.renderFilterTransmissionType.bind(
            this
        );
        this.renderFilterFeatures = this.renderFilterFeatures.bind(this);
        this.renderX = this.renderX.bind(this);
    }

    renderX() {
        return (
            <SVGInline
                height="10px"
                width="10px"
                className="filterbar__filter-x"
                svg={zondicons['close']}
            />
        );
    }

    renderFilterTransmissionType(transmissionType) {
        return (
            <div
                className="filterbar__filter"
                onClick={this.props.chooseTransmissionType.bind(
                    null,
                    transmissionType
                )}
            >
                {transmissionType} {this.renderX()}
            </div>
        );
    }

    renderFilterFuelType(fuelType) {
        return (
            <div
                className="filterbar__filter"
                onClick={this.props.chooseFuelType.bind(null, fuelType)}
            >
                {fuelType} {this.renderX()}
            </div>
        );
    }

    renderFilterStyles(style, index) {
        return (
            <div
                key={index}
                className="filterbar__filter"
                onClick={this.props.toggleStyle.bind(null, style)}
            >
                {style} {this.renderX()}
            </div>
        );
    }

    renderFilterMakes(makeId, index) {
        const make = R.find(R.propEq('id', makeId), this.props.makes);

        return (
            <div
                key={index}
                className="filterbar__filter"
                onClick={this.props.toggleMake.bind(null, makeId)}
            >
                {make.attributes.name} {this.renderX()}
            </div>
        );
    }

    renderFilterFeatures(feature, index) {
        return (
            <div
                key={index}
                className="filterbar__filter"
                onClick={this.props.toggleFeature.bind(null, feature)}
            >
                {feature} {this.renderX()}
            </div>
        );
    }

    render() {
        return (
            <div className="filterbar">
                <SVGInline
                    height="20px"
                    width="20px"
                    className="filterbar__filter-icon"
                    svg={zondicons['filter']}
                />

                <div className="filterbar__filters">
                    {this.props.selectedStyles.map(this.renderFilterStyles)}
                    {this.props.selectedMakes.map(this.renderFilterMakes)}
                    {this.props.selectedFuelType ? (
                        this.renderFilterFuelType(this.props.selectedFuelType)
                    ) : (
                        ''
                    )}
                    {this.props.selectedTransmissionType ? (
                        this.renderFilterTransmissionType(
                            this.props.selectedTransmissionType
                        )
                    ) : (
                        ''
                    )}
                    {this.props.selectedFeatures.map(this.renderFilterFeatures)}
                </div>

                <div className="filterbar__clear">
                    <a onClick={this.props.clearAllFilters}>
                        Clear all filters
                    </a>
                </div>
            </div>
        );
    }
}

Filterbar.propTypes = {
    selectedStyles: PropTypes.arrayOf(PropTypes.string).isRequired,
    makes: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            attributes: PropTypes.shape({
                name: PropTypes.string.isRequired,
            }),
        })
    ),
    selectedMakes: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedTransmissionType: PropTypes.string,
    selectedFuelType: PropTypes.string,
    selectedFeatures: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function mapStateToProps(state) {
    return {
        selectedStyles: state.selectedStyles,
        makes: state.makes,
        selectedMakes: state.selectedMakes,
        selectedTransmissionType: state.selectedTransmissionType,
        selectedFuelType: state.selectedFuelType,
        selectedFeatures: state.selectedFeatures,
    };
}

export default connect(mapStateToProps, Actions)(Filterbar);
