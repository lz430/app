import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import { connect } from 'react-redux';
import * as Actions from 'actions';
import SVGInline from 'react-svg-inline';
import strings from 'src/strings';
import util from 'src/util';
import miscicons from 'miscicons';
import zondicons from 'zondicons';

class Targets extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { targetKey: null };
    }

    componentWillMount() {
        this.setState({
            targetKey: util.getTargetKeyForDealAndZip(
                this.props.deal,
                this.props.zipcode
            ),
        });

        if (this.targetsNotLoadedFor(this.state.targetKey)) {
            this.props.requestTargets(this.props.deal);
        }
    }

    targetsNotLoadedFor(targetKey) {
        return R.isNil(this.props.targetsAvailable[targetKey]);
    }

    availableTargets() {
        return this.props.targetsAvailable[this.state.targetKey] || [];
    }

    toggle(target) {
        this.props.toggleTarget(target, this.state.targetKey);
        this.props.targetsChanged();
    }

    renderTarget(target, index) {
        const isSelected = this.props.targetsSelected[this.state.targetKey] ? R.contains(
            target,
            this.props.targetsSelected[this.state.targetKey]
        ) : false;

        const checkboxClass = `rebates__checkbox rebates__checkbox--inverted ${
            isSelected ? 'rebates__checkbox--selected' : ''
        }`;

        return (
            <div
                key={index}
                onClick={this.toggle.bind(this, target)}
                className={`rebates__rebate`}
            >
                {isSelected ? (
                    <SVGInline
                        width="15px"
                        height="15px"
                        className={checkboxClass}
                        svg={zondicons['checkmark']}
                    />
                ) : (
                    <div className="rebates__checkbox" />
                )}
                <div className="rebates__title">
                    {strings.toTitleCase(target.targetName)}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                <h4>Select Your Target</h4>
                <div className="rebates">
                    {this.props ? (
                        this.availableTargets().map((target, index) =>
                            this.renderTarget(target, index)
                        )
                    ) : (
                        <SVGInline svg={miscicons['loading']} />
                    )}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        zipcode: state.zipcode,
        targetsAvailable: state.targetsAvailable,
        targetsSelected: state.targetsSelected,
    };
}

Targets.propTypes = {
    deal: PropTypes.object.isRequired,
    targetsChanged: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, Actions)(Targets);
