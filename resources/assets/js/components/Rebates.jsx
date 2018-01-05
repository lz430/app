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

class Rebates extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            compatibleRebateIds: null,
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        this.updateCompatibleTargets(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (
            this.props.selectedTargets.length !==
                nextProps.selectedTargets.length &&
            nextProps.zipcode
        ) {
            this.updateCompatibleTargets(nextProps);
        }
    }

    updateCompatibleTargets(props) {
        // @todo this should probably instead make a new call to calculate stuff...
        api
            .getTargets(
                props.zipcode,
                props.deal.vin,
            )
            .then(response => {
                if (!this._isMounted) return;

                alert('got it');
                console.log(response);

                this.setState({
                    compatibleRebateIds: R.map(
                        R.prop('id'),
                        R.filter(
                            R.compose(
                                R.not(),
                                R.propEq('statusName', 'Excluded')
                            ),
                            response.data.rebates
                        )
                    ),
                });
            });
    }

    toggleTarget(target) {
        this.setState(
            {
                compatibleRebateIds: null,
            },
            () => {
                this.props.toggleTarget(target);
            }
        );
    }

    renderTarget(target, index) {
        const isSelected = R.contains(target, this.props.selectedTargets);
        const isSelectable = R.contains(
            target.id,
            this.state.compatibleRebateIds
        );
        const checkboxClass = `rebates__checkbox rebates__checkbox--inverted ${isSelected
            ? 'rebates__checkbox--selected'
            : ''}`;

        return (
            <div
                onClick={
                    isSelectable ? () => this.toggleTarget(target) : R.identity
                }
                className={`rebates__rebate ${isSelectable
                    ? ''
                    : 'rebates__rebate--disabled'}`}
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
                {this.state.compatibleRebateIds ? (
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

export default connect(mapStateToProps, Actions)(Rebates);
