import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';

class FilterFeatureList extends React.PureComponent {
    static propTypes = {
        features: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
                count: PropTypes.number.isRequired,
            }).isRequired
        ),

        selectedFeatures: PropTypes.arrayOf(PropTypes.string).isRequired,
        onToggleFeature: PropTypes.func.isRequired,
    };

    render() {
        if (!this.props.features) {
            return <div />;
        }

        return (
            <div className="filter-selector">
                {this.props.features.map((feature, index) => {
                    return (
                        <div
                            key={index}
                            className="filter-selector__selector"
                            onClick={this.props.onToggleFeature.bind(
                                null,
                                feature.label
                            )}
                        >
                            {R.contains(
                                feature.value,
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
                            {feature.label}
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default FilterFeatureList;
