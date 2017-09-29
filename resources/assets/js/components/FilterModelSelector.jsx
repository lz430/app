import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import miscicons from 'miscicons';

class FilterModelSelector extends React.PureComponent {
    render() {
        return (
            <div className="filter-selector">
                {this.props.models ? (
                    this.props.models.map((model, index) => {
                        return (
                            <div
                                key={index}
                                className="filter-selector__selector"
                                onClick={this.props.onSelectModel.bind(
                                    null,
                                    model
                                )}
                            >
                                {R.contains(
                                    model,
                                    this.props.selectedModels
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
                                {model.attributes.name}
                            </div>
                        );
                    })
                ) : (
                    <SVGInline svg={miscicons['loading']} />
                )}
            </div>
        );
    }
}

FilterModelSelector.propTypes = {
    models: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
        })
    ),
    selectedModels: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
        })
    ),
    onSelectModel: PropTypes.func.isRequired,
};

export default FilterModelSelector;
