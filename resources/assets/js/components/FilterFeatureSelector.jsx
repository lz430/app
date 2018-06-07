import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';

class FilterFeatureSelector extends React.PureComponent {
    static propTypes = {
        features: PropTypes.arrayOf(
            PropTypes.shape({
                attributes: PropTypes.shape({
                    title: PropTypes.string.isRequired,
                }),
            }).isRequired
        ).isRequired,
        selectedFeatures: PropTypes.arrayOf(PropTypes.string).isRequired,
        onSelectFeature: PropTypes.func.isRequired,
    };

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
                                feature.attributes.title
                            )}
                        >
                            {R.contains(
                                feature.attributes.title,
                                this.props.selectedFeatures
                            ) ? (
                                <SVGInline
                                    width="15px"
                                    height="15px"
                                    className="filter-selector__checkbox filter-selector__checkbox--selected"
                                    svg={zondicons['checkmark']}
                                />
                            ) : (
                                <div className="filter-selector__checkbox" />
                            )}
                            {feature.attributes.title}
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default FilterFeatureSelector;
