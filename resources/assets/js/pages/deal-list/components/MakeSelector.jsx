import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import R from 'ramda';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';
import { toggleSearchFilter } from '../actions';
import { getSelectedFiltersByCategory } from '../selectors';

class MakeSelector extends React.PureComponent {
    static propTypes = {
        makes: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
                count: PropTypes.number.isRequired,
                icon: PropTypes.string.isRequired,
            })
        ),
        selectedFiltersByCategory: PropTypes.object.isRequired,
        searchQuery: PropTypes.object.isRequired,
        fallbackLogoImage: PropTypes.string.isRequired,
        onToggleSearchFilter: PropTypes.func.isRequired,
    };

    constructor() {
        super();
        this.state = {
            animating: 'false',
        };
        this.renderMake = this.renderMake.bind(this);
        this.getLogoFor = this.getLogoFor.bind(this);
    }

    logoMissing() {
        return R.has('icon') && R.propEq('icon', '');
    }

    getLogoFor(make) {
        return R.ifElse(
            this.logoMissing(make),
            () => this.props.fallbackLogoImage,
            R.prop('icon')
        ).bind(this)(make);
    }

    renderMake(make) {
        const selected =
            this.props.selectedFiltersByCategory &&
            this.props.selectedFiltersByCategory.make &&
            R.contains(make.value, this.props.searchQuery.makes);

        const className = `make-selector__make ${
            selected ? 'make-selector__make--selected' : ''
        }`;

        return (
            <div
                className={className}
                onClick={() => this.props.onToggleSearchFilter(make)}
                key={make.value}
            >
                <img src={this.getLogoFor(make)} />
                <div className="make-selector__make-name">{make.label}</div>
            </div>
        );
    }

    render() {
        return (
            <div className="make-selector" onClick={this.props.animate}>
                <div className="make-selector__makes">
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

const mapStateToProps = state => {
    return {
        makes: state.pages.dealList.filters.make,
        selectedFiltersByCategory: getSelectedFiltersByCategory(state),
        searchQuery: state.pages.dealList.searchQuery,
        fallbackLogoImage: state.common.fallbackLogoImage,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onToggleSearchFilter: item => {
            return dispatch(toggleSearchFilter('make', item));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MakeSelector);
