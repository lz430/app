import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';

class FilterMakeList extends React.PureComponent {
    static propTypes = {
        makes: PropTypes.arrayOf(
            PropTypes.shape({
                value: PropTypes.string,
                label: PropTypes.string,
                count: PropTypes.number,
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
        let className = R.contains(make.value, this.props.selectedMakes)
            ? 'filter-make-selector__make filter-make-selector__make--selected'
            : 'filter-make-selector__make';

        return (
            <div
                className={className}
                key={make.value}
                onClick={this.props.onSelectMake.bind(null, make.value)}
            >
                <div className="filter-make-selector__name">{make.label}</div>
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

export default FilterMakeList;
