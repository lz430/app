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
                id: PropTypes.string.isRequired,
                attributes: PropTypes.shape({
                    name: PropTypes.string.isRequired,
                    logo: PropTypes.string.isRequired,
                }),
            })
        ),
        selectedMakes: PropTypes.arrayOf(PropTypes.string),
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
            this.logoMissing(make.attributes),
            () => this.props.fallbackLogoImage,
            R.prop('logo')
        ).bind(this)(make.attributes);
    }

    renderMake(make) {
        const selected =
            this.props.selectedMakes &&
            R.contains(make.id, this.props.selectedMakes);
        const className = `make-selector__make ${selected
            ? 'make-selector__make--selected'
            : ''}`;

        return (
            <div
                className={className}
                onClick={() => this.props.toggleMake(make.id)}
                key={make.id}
            >
                <img src={this.getLogoFor(make)} />
                <div className="make-selector__make-name">
                    {make.attributes.name}
                </div>
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
        selectedMakes: state.selectedMakes,
        fallbackLogoImage: state.fallbackLogoImage,
    };
};

export default connect(mapStateToProps, Actions)(MakeSelector);
