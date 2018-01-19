import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import { connect } from 'react-redux';
import * as Actions from 'actions';
import SVGInline from 'react-svg-inline';
import rebates from 'src/rebates';
import strings from 'src/strings';
import miscicons from 'miscicons';
import zondicons from 'zondicons';

class Targets extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if (this.targetsNotLoaded()) {
            this.props.requestTargets(this.props.deal);
        }
    }

    targetsNotLoaded() {
        return R.isEmpty(this.props.dealTargets[this.props.deal.id]);
    }

    // All Targets that are available to be selected for a specific deal
    availableTargets() {
        return this.props.dealTargets[this.props.deal.id] || [];
    }

    toggle(target) {
        this.props.toggleTarget(target);
        this.props.targetsChanged();
    }

    renderTarget(target, index) {
        const isSelected = R.contains(
            target,
            rebates.getSelectedTargetsForDeal(
                this.props.dealTargets,
                this.props.selectedTargets,
                this.props.deal
            )
        );
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
                <h4>Select </h4>
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
        dealTargets: state.dealTargets,
        selectedTargets: state.selectedTargets,
    };
}

Targets.propTypes = {
    deal: PropTypes.object.isRequired,
    targetsChanged: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, Actions)(Targets);
