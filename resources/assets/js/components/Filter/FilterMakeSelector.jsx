import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';

class FilterMakeSelector extends React.PureComponent {
    static propTypes = {
        makes: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
                logo: PropTypes.string,
            })
        ),
        selectedMakes: PropTypes.arrayOf(PropTypes.string),
        onSelectMake: PropTypes.func.isRequired,
    };

    constructor() {
        super();

        this.renderMake = this.renderMake.bind(this);
    }

    renderMake(make) {
        let className = R.contains(make.id, this.props.selectedMakes)
            ? 'filter-make-selector__make filter-make-selector__make--selected'
            : 'filter-make-selector__make';

        return (
            <div
                className={className}
                key={make.id}
                onClick={this.props.onSelectMake.bind(null, make.id)}
            >
                <div className="filter-make-selector__name">
                    {make.attributes.name}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="filter-make-selector">
                <div className="filter-make-selector__makes">
                    {this.props.makes ? (
                        this.props.makes.map(this.renderMake)
                    ) : (
                        <SVGInline svg={miscicons['loading']} />
                    )}
                </div>
            </div>
        );
    }
}

export default FilterMakeSelector;
