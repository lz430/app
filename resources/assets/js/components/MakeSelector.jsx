import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import R from 'ramda';
import * as Actions from 'actions/index';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';

class MakeSelector extends React.PureComponent {
    static propTypes = {
        makes: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                logo: PropTypes.string.isRequired,
            })
        ),
        searchQuery: PropTypes.object.isRequired,
        fallbackLogoImage: PropTypes.string.isRequired,
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
        return R.has('logo') && R.propEq('logo', '');
    }

    getLogoFor(make) {
        return R.ifElse(
            this.logoMissing(make),
            () => this.props.fallbackLogoImage,
            R.prop('logo')
        ).bind(this)(make);
    }

    renderMake(make) {
        console.log(this.props.searchQuery.makes);
        const selected =
            this.props.searchQuery.makes &&
            R.contains(make.name, this.props.searchQuery.makes);
        const className = `make-selector__make ${
            selected ? 'make-selector__make--selected' : ''
        }`;

        return (
            <div
                className={className}
                onClick={() => this.props.toggleMake(make.name)}
                key={make.name}
            >
                <img src={this.getLogoFor(make)} />
                <div className="make-selector__make-name">{make.name}</div>
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
        makes: state.makes,
        searchQuery: state.searchQuery,
        fallbackLogoImage: state.fallbackLogoImage,
    };
};

export default connect(
    mapStateToProps,
    Actions
)(MakeSelector);
