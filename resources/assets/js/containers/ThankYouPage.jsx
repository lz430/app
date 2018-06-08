import React from 'react';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import Modal from 'components/Modal';
import strings from 'src/strings';
import api from 'src/api';
import R from 'ramda';
import util from 'src/util';
import miscicons from 'miscicons';
import { makeDealBestOfferTotalValue } from 'selectors/index';

class ThankYouPage extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            warranties: null,
            dimensions: null,
            showStandardFeatures: false,
            showFeatures: false,
        };
    }

    componentDidMount() {
        api.getDimensions(this.props.deal.version.jato_vehicle_id).then(
            response => {
                this.setState({
                    dimensions: response.data,
                });
            }
        );

        api.getWarranties(this.props.deal.version.jato_vehicle_id).then(
            response => {
                this.setState({
                    warranties: response.data,
                });
            }
        );
    }

    showStandardFeatures() {
        this.setState({
            showStandardFeatures: true,
        });
    }

    showFeatures() {
        this.setState({
            showFeatures: true,
        });
    }

    renderFeaturesModal(deal) {
        return (
            <Modal onClose={() => this.hideModals()}>
                <div className="modal__content">
                    <div className="modal__sticker-container">
                        <div className="modal__sticker">Additional Options</div>
                    </div>
                    <div className="modal__header">
                        <div className="modal__titles modal__titles--center">
                            <div className="modal__subtitle modal__subtitle--center">
                                {strings.dealYearMake(deal)}
                            </div>
                            <div className="modal__title modal_title--center">
                                {strings.dealModelTrim(deal)}
                            </div>
                        </div>
                        <div className="modal__close">
                            <SVGInline
                                onClick={() => this.hideModals()}
                                height="20px"
                                width="20px"
                                className="modal__close-x"
                                svg={zondicons['close']}
                            />
                        </div>
                    </div>
                </div>
                <div className="deal-details__modal-body">
                    <ul>
                        {this.props.features.map((feature, index) => {
                            return <li key={index}>{feature}</li>;
                        })}
                    </ul>
                </div>
            </Modal>
        );
    }

    renderStandardFeaturesModal(deal) {
        return (
            <Modal onClose={() => this.hideModals()}>
                <div className="modal__content">
                    <div className="modal__sticker-container">
                        <div className="modal__sticker">Standard Features</div>
                    </div>
                    <div className="modal__header">
                        <div className="modal__titles modal__titles--center">
                            <div className="modal__subtitle modal__subtitle--center">
                                {strings.dealYearMake(deal)}
                            </div>
                            <div className="modal__title modal_title--center">
                                {strings.dealModelTrim(deal)}
                            </div>
                        </div>
                        <div className="modal__close">
                            <SVGInline
                                onClick={() => this.hideModals()}
                                height="20px"
                                width="20px"
                                className="modal__close-x"
                                svg={zondicons['close']}
                            />
                        </div>
                    </div>
                </div>
                <div className="deal-details__modal-body">
                    <h3>Specifications</h3>
                    <hr />

                    <h4>Dimensions</h4>
                    <ul>
                        {this.state.dimensions
                            ? this.state.dimensions.map((dimension, index) => {
                                  return (
                                      <li key={index}>
                                          {dimension.feature}:{' '}
                                          {dimension.content}
                                      </li>
                                  );
                              })
                            : 'Loading...'}
                    </ul>

                    <h4>Warranties</h4>
                    <ul>
                        {this.state.warranties
                            ? this.state.warranties.map((dimension, index) => {
                                  return (
                                      <li key={index}>
                                          {dimension.feature}:{' '}
                                          {dimension.content}
                                      </li>
                                  );
                              })
                            : 'Loading...'}
                    </ul>

                    <h3>Features</h3>
                    <hr />

                    <ul>
                        {this.props.features.map((feature, index) => {
                            return <li key={index}>{feature}</li>;
                        })}
                    </ul>
                </div>
            </Modal>
        );
    }

    youChoseString(purchase) {
        switch (purchase.data.attributes.type) {
            case 'cash':
                return 'CASH PURCHASE';
                break;
            case 'finance':
                return 'THIRD PARTY FINANCING';
                break;
            case 'lease':
                return 'LEASE DEAL';
                break;
            default:
                return 'CASH PURCHASE';
        }
    }

    hideModals() {
        this.setState({
            showStandardFeatures: false,
            showFeatures: false,
        });
    }

    render() {
        return (
            <div>
                <div className="thank-you">
                    {this.state.showStandardFeatures
                        ? this.renderStandardFeaturesModal(this.props.deal)
                        : ''}
                    {this.state.showFeatures
                        ? this.renderFeaturesModal(this.props.deal)
                        : ''}
                    <div className="thank-you__left-panel">
                        <div className="thank-you__title-model-trim">
                            Vehicle Purchase Summary
                        </div>
                        <div className="thank-you__title-year-make">
                            {`${this.props.deal.year} ${this.props.deal.make} ${
                                this.props.deal.model
                            }`}
                            {/*  {`${this.props.deal.year} ${this.props.deal.make} ${
                                this.props.deal.model
                            } ${this.props.deal.series} VIN#:${
                                this.props.deal.vin
                            }`} */}
                        </div>
                        <div className="thank-you__primary-image">
                            <img src={this.props.deal.photos[1].url} />
                        </div>
                        <div className="thank-you__congrats-text">
                            <div className="thank-you__congrats-headline">
                                Congratulations on your purchase!
                            </div>
                            <div className="thank-you__congrats-body">
                                A Deliver My Ride representative will contact
                                you shortly to schedule your delivery. If past
                                regular hours of operation, you can expect a
                                call early the next business day.
                            </div>
                            <div className="thank-you__congrats-subheadline">
                                Vehicle availability subject to change. See
                                Terms of Use for details.
                            </div>
                        </div>
                        {/* <div className="thank-you__left-panel-buttons">
                            <button
                                onClick={() => this.showStandardFeatures()}
                                className="thank-you__button thank-you__button--blue"
                            >
                                Review Standard Features
                            </button>
                            <button
                                onClick={() => this.showFeatures()}
                                className="thank-you__button thank-you__button--blue"
                            >
                                Review Additional Options
                            </button>
                        </div> */}
                    </div>
                    <div className="thank-you__pricing">
                        <div className="thank-you__choice">
                            YOU CHOSE:{' '}
                            {this.youChoseString(this.props.purchase)}
                        </div>
                        <div className="thank-you__your-price-label">
                            YOUR OUT THE DOOR PRICE
                        </div>
                        <div className="thank-you__your-price">
                            {util.moneyFormat(
                                this.props.purchase.data.attributes.dmr_price
                            )}
                        </div>
                        <div className="thank-you__plate-fee">
                            (plate fee not included)
                        </div>
                        <div className="thank-you__hr" />
                        <div className="thank-you__msrp">
                            {util.moneyFormat(
                                this.props.purchase.data.attributes.msrp
                            )}{' '}
                            <span className="thank-you__msrp-label">MSRP</span>
                        </div>
                        {this.props.dealBestOfferTotalValue ? (
                            <div className="thank-you__rebates-applied">
                                Rebates Applied:{' '}
                                {util.moneyFormat(
                                    this.props.dealBestOfferTotalValue
                                )}
                            </div>
                        ) : (
                            <SVGInline svg={miscicons['loading']} />
                        )}
                        <div className="thank-you__hr thank-you__hr--full" />
                        <div>
                            <div className="thank-you__finalize-items">
                                Items needed to finalize your purchase:
                            </div>
                            <div className="thank-you__hr thank-you__hr--full" />
                            <ul>
                                <li>Driver’s License</li>
                                <li>Certificate of Insurance</li>
                                <span className="thank-you__sub-li">
                                    Call your agent with vehicle details and
                                    VIN#
                                </span>
                                <li>
                                    Certified Check in the amount listed above.
                                </li>
                                <span className="thank-you__sub-li">
                                    Dealer will calculate the license plate fee.
                                </span>
                                <li>Registration</li>
                                <span className="thank-you__sub-li">
                                    Needed if transferring a valid license
                                    plate.
                                </span>
                                <li>
                                    Proof of eligibility for selected rebates
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const makeMapStateToProps = () => {
    const getDealBestOfferTotalValue = makeDealBestOfferTotalValue();
    const mapStateToProps = (state, props) => {
        return {
            dealBestOfferTotalValue: getDealBestOfferTotalValue(state, props),
        };
    };
    return mapStateToProps;
};

export default connect(
    makeMapStateToProps,
    Actions
)(ThankYouPage);
