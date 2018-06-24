import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import { connect } from 'react-redux';
import * as Actions from 'apps/common/actions';
import SVGInline from 'react-svg-inline';
import strings from 'src/strings';
import miscicons from 'miscicons';
import zondicons from 'zondicons';
import {
    makeDealTargetsAvailable,
    makeDealTargetsAvailableLoading,
    makeDealTargetKey,
} from 'apps/common/selectors';
import Line from '../pages/deal-detail/components/pricing/Line';
import Label from '../pages/deal-detail/components/pricing/Label';
import Value from '../pages/deal-detail/components/pricing/Value';

class Targets extends React.PureComponent {
    static propTypes = {
        deal: PropTypes.object.isRequired,
        targetsChanged: PropTypes.func.isRequired,
    };

    componentWillMount() {
        this.props.requestTargets(this.props.deal);
    }

    toggle(target) {
        this.props.toggleTarget(target, this.props.dealTargetKey);
        this.props.targetsChanged();
    }

    renderTarget(target, index) {
        const isSelected = this.props.targetsSelected[this.props.dealTargetKey]
            ? R.contains(
                  target,
                  this.props.targetsSelected[this.props.dealTargetKey]
              )
            : false;

        const checkboxClass = `rebates__checkbox rebates__checkbox--inverted ${
            isSelected ? 'rebates__checkbox--selected' : ''
        }`;

        return (
            <Line key={index}>
                <Label>
                    <div onClick={this.toggle.bind(this, target)}>
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
                        <div>{strings.toTitleCase(target.targetName)}</div>
                    </div>
                </Label>
            </Line>
        );

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

    renderAvailableTargets() {
        return (
            <div className="rebates">
                {this.props.dealTargetsAvailable.length == 0 ? (
                    <div />
                ) : (
                    <div>
                        <Line>
                            <Label>Additional Rebates</Label>
                            <div
                                style={{
                                    fontSize: '.75em',
                                    marginLeft: '.25em',
                                }}
                            >
                                Select all that apply
                            </div>
                            <div
                                style={{
                                    fontStyle: 'italic',
                                    fontSize: '.75em',
                                    marginLeft: '.25em',
                                }}
                            >
                                Proof of eligibility required.
                            </div>
                        </Line>
                        {this.props.dealTargetsAvailable.map((target, index) =>
                            this.renderTarget(target, index)
                        )}
                    </div>
                )}
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.props.dealTargetsAvailableLoading ? (
                    <SVGInline svg={miscicons['loading']} />
                ) : (
                    this.renderAvailableTargets()
                )}
            </div>
        );
    }
}

const makeMapStateToProps = () => {
    const getDealTargetKey = makeDealTargetKey();
    const getDealTargetsAvailable = makeDealTargetsAvailable();
    const getDealTargetsAvailableLoading = makeDealTargetsAvailableLoading();
    return (state, props) => {
        return {
            zipcode: state.common.zipcode,
            targetsAvailable: state.common.targetsAvailable,
            targetsSelected: state.common.targetsSelected,
            dealTargetKey: getDealTargetKey(state, props),
            dealTargetsAvailable: getDealTargetsAvailable(state, props),
            dealTargetsAvailableLoading: getDealTargetsAvailableLoading(
                state,
                props
            ),
        };
    };
};

export default connect(
    makeMapStateToProps,
    Actions
)(Targets);
