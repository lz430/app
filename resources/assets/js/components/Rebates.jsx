import React from 'react';
import R from 'ramda';
import util from 'src/util';
import rebates from 'src/rebates';
import api from 'src/api';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
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
        this.updateCompatibleRebates(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (
            this.props.selectedRebates.length !==
            nextProps.selectedRebates.length
        ) {
            this.updateCompatibleRebates(nextProps);
        }
    }

    updateCompatibleRebates(props) {
        api
            .getRebates(
                props.zipcode,
                props.deal.vin,
                R.map(R.prop('id'), props.selectedRebates)
            )
            .then(response => {
                if (!this._isMounted) return;

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

    toggleRebate(rebate) {
        this.setState(
            {
                compatibleRebateIds: null,
            },
            () => {
                this.props.toggleRebate(rebate);
            }
        );
    }

    renderRebate(rebate, index) {
        const isSelected = R.contains(rebate, this.props.selectedRebates);
        const isSelectable = R.contains(
            rebate.id,
            this.state.compatibleRebateIds
        );
        const checkboxClass = `rebates__checkbox rebates__checkbox--inverted ${isSelected
            ? 'rebates__checkbox--selected'
            : ''}`;

        return (
            <div
                onClick={
                    isSelectable ? () => this.toggleRebate(rebate) : R.identity
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
                <div className="rebates__title">{rebate.rebate}</div>
                <div className="rebates__value">
                    -{util.moneyFormat(rebate.value)}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="rebates">
                {this.state.compatibleRebateIds ? (
                    this.props.availableRebates.map((rebate, index) =>
                        this.renderRebate(rebate, index)
                    )
                ) : (
                    'Loading...'
                )}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        zipcode: state.zipcode,
        deal: state.selectedDeal,
        availableRebates: rebates.getAvailableRebatesForDealAndType(
            state.dealRebates,
            state.selectedRebates,
            state.selectedTab,
            state.selectedDeal
        ),
        selectedRebates: rebates.getSelectedRebatesForDealAndType(
            state.dealRebates,
            state.selectedRebates,
            state.selectedTab,
            state.selectedDeal
        ),
    };
}

export default connect(mapStateToProps, Actions)(Rebates);
