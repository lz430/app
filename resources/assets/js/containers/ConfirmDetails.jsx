import * as Actions from 'actions/index';
import CashFinanceLeaseCalculator from 'components/CashFinanceLeaseCalculator';
import ConfirmDeal from 'components/ConfirmDeal';
import { connect } from 'react-redux';
import Modal from 'components/Modal';
import PropTypes from 'prop-types';
import purchase from 'src/purchase';
import R from 'ramda';
import React from 'react';
import rebates from 'src/rebates';
import strings from 'src/strings';

class ConfirmDetails extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            featuredImage: props.deal.photos[0],
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;

    }

    renderFeaturedImage() {
        return (
            <img
                className="deal-details__primary-image"
                src={R.propOr(this.state.q, 'url', this.state.featuredImage)}
            />
        );
    }

    renderCalculatorModal() {
        return (
            <Modal
                onClose={this.props.clearSelectedDeal}
                closeText="Back to results"
            >
                <CashFinanceLeaseCalculator />
            </Modal>
        );
    }

    renderDeal(deal, index) {
        return (
            <ConfirmDeal deal={deal} key={index} hideImageAndTitle={true}>
                <div className="deal-details__deal-content">
                    <div className="deal-details__buttons">
                        <button
                            className="deal-details__button deal-details__button--small deal-details__button--pink"
                            onClick={() =>
                                purchase.start(
                                    deal,
                                    this.props.selectedTab,
                                    this.props.downPayment,

                                    // @TODO Update this to handle.. what. targets? some other number
                                    // that's influenced by the selected targets?
                                    /*rebates.getSelectedRebatesForDealAndType(
                                        this.props.dealTargets,
                                        this.props.selectedRebates,
                                        this.props.selectedTab,
                                        deal
                                    ),*/
                                    [], /* ?!?!?!?!?! @TODO */
                                    [],
                                    this.props.termDuration,
                                    this.props.employeeBrand
                                )}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </ConfirmDeal>
        );
    }

    render() {
        const deal = this.props.deal;

        return (
            <div>
                <div className="deal-details">
                    <div className="deal-details__images-and-title">
                        <div className="deal-details__title">
                            <div className="deal-details__title-year-make">
                                {strings.dealYearMake(this.props.deal)}
                            </div>
                            <div className="deal-details__title-model-trim">
                                {strings.dealModelTrim(this.props.deal)}
                            </div>
                        </div>
                        <div className="deal-details__images">
                            {this.renderFeaturedImage()}
                        </div>
                    </div>
                    <div className="deal-details__pricing">
                        {this.renderDeal(deal)}
                    </div>
                    {this.props.selectedDeal ? this.renderCalculatorModal() : ''}
                </div>
            </div>
        );
    }
}

ConfirmDetails.propTypes = {
    deal: PropTypes.shape({
        year: PropTypes.string.isRequired,
        msrp: PropTypes.number.isRequired,
        employee_price: PropTypes.number.isRequired,
        supplier_price: PropTypes.number.isRequired,
        make: PropTypes.string.isRequired,
        model: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        vin: PropTypes.string.isRequired,
    }),
};

const mapStateToProps = state => {
    return {
        selectedTab: state.selectedTab,
        downPayment: state.downPayment,
        dealTargets: state.dealTargets,
        termDuration: state.termDuration,
        fallbackDealImage: state.fallbackDealImage,
        selectedDeal: state.selectedDeal,
        employeeBrand: state.employeeBrand,
    };
};

export default connect(mapStateToProps, Actions)(ConfirmDetails);
