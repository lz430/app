import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import R from 'ramda';
import * as ActionTypes from 'actiontypes/index';
import * as Actions from 'actions/index';

class MakeSelector extends React.Component {
    constructor() {
        super();

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
        let selected = R.contains(make.id, this.props.selectedMakes);
        let className = `make-selector__make ${selected ? 'make-selector__make--selected' : ''}`;

        return (
            <div
                className={className}
                onClick={() => this.props.toggleMake(make.id)}
                key={make.id}
            >
                <img src={this.getLogoFor(make)} />
            </div>
        );
    }

    render() {
        return (
            <div className="make-selector">
                <div className="make-selector__title">
                    Select Several Brands To Compare
                </div>

                <div className="make-selector__makes">
                    {this.props.makes.map(this.renderMake)}
                </div>
            </div>
        );
    }
}

// MakeSelector.propTypes = {
//     makes: PropTypes.arrayOf(
//         PropTypes.shape({
//             id: PropTypes.string.isRequired,
//             attributes: PropTypes.shape({
//                 name: PropTypes.string.isRequired,
//                 logo: PropTypes.string.isRequired,
//             }),
//         })
//     ).isRequired,
//     selectedMakes: PropTypes.arrayOf(PropTypes.string).isRequired,
//     fallbackLogoImage: PropTypes.string.isRequired,
// };


const mapStateToProps = (state) => {
    return {
        makes: state.makes,
        selectedMakes: state.selectedMakes,
        fallbackLogoImage: state.fallbackLogoImage,
    }
};

export default connect(mapStateToProps, Actions)(MakeSelector);
