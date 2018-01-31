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
import {
    makeDealTargetsAvailable,
    makeDealTargetsAvailableLoading,
    makeDealTargetKey,
} from 'selectors/index';

class Targets extends React.PureComponent {
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
                    <h4>No Selectable Targets Available</h4>
                ) : (
                    <div>
                        <h4>Select Your Targets</h4>
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
    const mapStateToProps = (state, props) => {
        return {
            zipcode: state.zipcode,
            targetsAvailable: state.targetsAvailable,
            targetsSelected: state.targetsSelected,
            dealTargetKey: getDealTargetKey(state, props),
            dealTargetsAvailable: getDealTargetsAvailable(state, props),
            dealTargetsAvailableLoading: getDealTargetsAvailableLoading(
                state,
                props
            ),
        };
    };
    return mapStateToProps;
};

Targets.propTypes = {
    deal: PropTypes.object.isRequired,
    targetsChanged: PropTypes.func.isRequired,
};

export default connect(makeMapStateToProps, Actions)(Targets);
