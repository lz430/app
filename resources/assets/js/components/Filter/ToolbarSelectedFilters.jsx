import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import R from 'ramda';
import { connect } from 'react-redux';
import * as Actions from 'actions';

/**
 *
 */
class ToolbarSelectedFilters extends React.PureComponent {
    static propTypes = {
        searchQuery: PropTypes.object.isRequired,
        makes: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                attributes: PropTypes.shape({
                    name: PropTypes.string.isRequired,
                }),
            })
        ),
    };

    constructor(props) {
        super(props);

        this.renderFilterStyles = this.renderFilterStyles.bind(this);
        this.renderFilterMakes = this.renderFilterMakes.bind(this);
        this.renderFilterModels = this.renderFilterModels.bind(this);
        this.renderFilterYear = this.renderFilterYear.bind(this);
        this.renderFilterFeatures = this.renderFilterFeatures.bind(this);
        this.renderX = this.renderX.bind(this);
    }

    renderX() {
        return <span />;

        return (
            <SVGInline
                height="10px"
                width="10px"
                className="filterbar__filter-x"
                svg={zondicons['close']}
            />
        );
    }

    renderFilterYear(year) {
        return (
            <div className="filterbar__filter">
                {/*
                onClick={this.props.chooseYear.bind(null, year)}
            */}
                {year} {this.renderX()}
            </div>
        );
    }

    renderFilterStyles(style, index) {
        return (
            <div key={index} className="filterbar__filter">
                {/*
                onClick={this.props.toggleStyle.bind(null, style)}
            */}
                {style} {this.renderX()}
            </div>
        );
    }

    renderFilterMakes(makeId, index) {
        const make = R.find(R.propEq('id', makeId), this.props.makes);

        return (
            <div key={index} className="filterbar__filter">
                {/*
                onClick={this.props.toggleMake.bind(null, makeId)}
            */}
                {make.attributes.name} {this.renderX()}
            </div>
        );
    }

    renderFilterModels(model, index) {
        return (
            <div key={index} className="filterbar__filter">
                {/*
                onClick={this.props.toggleModel.bind(null, model)}
            */}
                {model.attributes.name} {this.renderX()}
            </div>
        );
    }

    renderFilterFeatures(feature, index) {
        return (
            <div key={index} className="filterbar__filter">
                {/*
                onClick={this.props.toggleFeature.bind(null, feature)}
            */}
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
                    {this.props.searchQuery.styles.map(this.renderFilterStyles)}

                    {this.props.searchQuery.years[0]
                        ? this.renderFilterYear(this.props.searchQuery.years[0])
                        : ''}
                    {this.props.searchQuery.makes.map(this.renderFilterMakes)}
                    {this.props.searchQuery.features.map(
                        this.renderFilterFeatures
                    )}
                </div>

                <div className="filterbar__clear">
                    <a onClick={this.props.clearAllFilters}>Clear Options</a>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        makes: state.makes,
        searchQuery: state.searchQuery,
    };
}

export default connect(
    mapStateToProps,
    Actions
)(ToolbarSelectedFilters);
