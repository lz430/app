import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import miscicons from 'miscicons';

class FilterMakeSelector extends React.PureComponent {
    render() {
        return (
            <div className="filter-selector">
                {this.props.makes ? (
                    this.props.makes.map((make, index) => {
                        return (
                            <div
                                key={index}
                                className={R.contains(
                                    make.id,
                                    this.props.selectedMakes
                                ) ? "filter-selector__selector filter-selector__selector--selected" : "filter-selector__selector"}
                                onClick={this.props.onSelectMake.bind(
                                    null,
                                    make.id
                                )}
                            >
                                {R.contains(
                                    make.id,
                                    this.props.selectedMakes
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
                                {make.attributes.name}
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

FilterMakeSelector.propTypes = {
    makes: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            logo: PropTypes.string,
        })
    ),
    selectedMakes: PropTypes.arrayOf(PropTypes.string),
    onSelectMake: PropTypes.func.isRequired,
};

export default FilterMakeSelector;
