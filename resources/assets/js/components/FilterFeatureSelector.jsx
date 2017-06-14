import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';

class FilterFeatureSelector extends React.Component {
    render() {
        return (
            <div className="filter-selector">
                {this.props.features.map((feature, index) => {
                    return (
                        <div
                            key={index}
                            className="filter-selector__selector"
                            onClick={this.props.onSelectFeature.bind(
                                null,
                                feature.attributes.feature
                            )}
                        >
                            {R.contains(
                                feature.attributes.feature,
                                this.props.selectedFeatures
                            )
                                ? <SVGInline
                                      width="15px"
                                      height="15px"
                                      className="filter-selector__checkbox filter-selector__checkbox--selected"
                                      svg={zondicons['checkmark']}
                                  />
                                : <div className="filter-selector__checkbox" />}
                            {feature.attributes.feature}
                        </div>
                    );
                })}
            </div>
        );
    }
}

FilterFeatureSelector.propTypes = {
    features: PropTypes.arrayOf(
        PropTypes.shape({
            attributes: PropTypes.shape({
                feature: PropTypes.string.isRequired,
                group: PropTypes.string.isRequired,
            }),
        }).isRequired
    ).isRequired,
    selectedFeatures: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelectFeature: PropTypes.func.isRequired,
};

export default FilterFeatureSelector;
