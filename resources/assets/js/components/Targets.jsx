import React from 'react';
import R from 'ramda';
import util from 'src/util';
import rebates from 'src/rebates';
import api from 'src/api';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';
import zondicons from 'zondicons';
import strings from 'src/strings';
import { connect } from 'react-redux';
import * as Actions from 'actions';

class Targets extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    componentDidMount() {
        this._mounted = true;
    }

    toggleTarget(target) {
        this.props.toggleTarget(target);
    }

    renderTarget(target, index) {
        const isSelected = R.contains(target, this.props.selectedTargets);
        const checkboxClass = `rebates__checkbox rebates__checkbox--inverted ${isSelected
            ? 'rebates__checkbox--selected'
            : ''}`;

        return (
            <div
                onClick={
                    this.toggleTarget(target)
                }
                className={`rebates__rebate`}
                key={index}
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
            <div className="rebates">
                {this.props ? (
                    this.props.availableTargets.map((target, index) =>
                        this.renderTarget(target, index)
                    )
                ) : (
                    <SVGInline svg={miscicons['loading']} />
                )}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        zipcode: state.zipcode,
        deal: state.selectedDeal,
        availableTargets: rebates.getAvailableTargetsForDeal(
            state.dealTargets,
            state.selectedDeal
        ),
        selectedTargets: rebates.getSelectedTargetsForDeal(
            state.dealTargets,
            state.selectedTargets,
            state.selectedDeal
        )
    };
}

export default connect(mapStateToProps, Actions)(Targets);
