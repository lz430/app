import React from 'react';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import util from 'src/util';
import formulas from 'src/formulas';
import miscicons from 'miscicons';

import {
    makeDealBestOfferTotalValue,
    makeDealBestOfferLoading,
} from 'selectors/index';

class Pricing extends React.PureComponent {
    render() {
        return (
            <span>
                {this.props.dealBestOfferLoading ? (
                    <SVGInline svg={miscicons['loading']} />
                ) : (
                    util.moneyFormat(
                        formulas.calculateTotalCash(
                            util.getEmployeeOrSupplierPrice(
                                this.props.deal,
                                this.props.employeeBrand
                            ),
                            this.props.deal.doc_fee,
                            this.props.dealBestOfferTotalValue
                        )
                    )
                )}
            </span>
        );
    }
}

const makeMapStateToProps = () => {
    const getDealBestOfferTotalValue = makeDealBestOfferTotalValue();
    const getDealBestOfferLoading = makeDealBestOfferLoading();
    const mapStateToProps = (state, props) => {
        return {
            dealBestOfferTotalValue: getDealBestOfferTotalValue(state, props),
            dealBestOfferLoading: getDealBestOfferLoading(state, props),
        };
    };
    return mapStateToProps;
};

Pricing.PropTypes = {
    deal: PropTypes.object.isRequired,
};

export default connect(makeMapStateToProps, Actions)(Pricing);
