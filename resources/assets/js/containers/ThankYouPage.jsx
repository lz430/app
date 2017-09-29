import React from 'react';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import Modal from 'components/Modal';
import strings from 'src/strings';
import api from 'src/api';
import rebates from 'src/rebates';
import R from 'ramda';
import util from 'src/util';

class ThankYouPage extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            showModal: true,
            purchase: props.purchase.data.attributes,
            deal: props.purchase.data.attributes.deal.data.attributes,
            warranties: null,
            dimensions: null,
            showStandardFeatures: false,
            showFeatures: false,
            availableRebates: null,
            selectedRebates: null,
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            availableRebates: rebates.getAvailableRebatesForDealAndType(
                props.dealRebates,
                props.selectedRebates,
                props.purchase.data.attributes.type,
                props.purchase.data.attributes.deal.data
            ),
            selectedRebates: rebates.getSelectedRebatesForDealAndType(
                props.dealRebates,
                props.selectedRebates,
                props.purchase.data.attributes.type,
                props.purchase.data.attributes.deal.data
            ),
        });
    }

    componentDidMount() {
        api
            .getDimensions(this.state.deal.versions[0].jato_vehicle_id)
            .then(response => {
                this.setState({
                    dimensions: response.data,
                });
            });

        api
            .getWarranties(this.state.deal.versions[0].jato_vehicle_id)
            .then(response => {
                this.setState({
                    warranties: response.data,
                });
            });
    }

    handleModalClose() {
        this.setState({
            showModal: false,
        });
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
            <Modal>
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
                        {deal.features.map((feature, index) => {
                            return <li key={index}>{feature.feature}</li>;
                        })}
                    </ul>
                </div>
            </Modal>
        );
    }

    renderStandardFeaturesModal(deal) {
        return (
            <Modal>
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
                        {this.state.dimensions ? (
                            this.state.dimensions.map((dimension, index) => {
                                return (
                                    <li key={index}>
                                        {dimension.feature}: {dimension.content}
                                    </li>
                                );
                            })
                        ) : (
                            'Loading...'
                        )}
                    </ul>

                    <h4>Warranties</h4>
                    <ul>
                        {this.state.warranties ? (
                            this.state.warranties.map((dimension, index) => {
                                return (
                                    <li key={index}>
                                        {dimension.feature}: {dimension.content}
                                    </li>
                                );
                            })
                        ) : (
                            'Loading...'
                        )}
                    </ul>

                    <h3>Features</h3>
                    <hr />

                    <ul>
                        {deal.vauto_features.map((feature, index) => {
                            return <li key={index}>{feature}</li>;
                        })}
                    </ul>
                </div>
            </Modal>
        );
    }

    renderNewPurchaseModal() {
        return (
            <Modal closeText="Close" onClose={() => this.handleModalClose()}>
                <div className="thank-you__modal">
                    <div className="thank-you__modal-close">
                        <SVGInline
                            onClick={() => this.handleModalClose()}
                            height="20px"
                            width="20px"
                            className="modal__close-x"
                            svg={zondicons['close']}
                        />
                    </div>
                    <div className="thank-you__modal-image">
                        <img src={this.state.deal.photos[1].url} />
                    </div>
                    <div className="thank-you__modal-text">
                        <h1>Congratulations on your new purchase!</h1>
                        <h2>
                            Shortly, a certified Deliver My Ride representative
                            will contact you to finalize your paperwork details
                            and to schedule the place and time for your
                            delivery.
                        </h2>
                    </div>
                </div>
            </Modal>
        );
    }

    youChoseString(purchase) {
        switch (purchase.type) {
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
                    {this.state.showModal ? this.renderNewPurchaseModal() : ''}
                    {this.state.showStandardFeatures ? (
                        this.renderStandardFeaturesModal(this.state.deal)
                    ) : (
                        ''
                    )}
                    {this.state.showFeatures ? (
                        this.renderFeaturesModal(this.state.deal)
                    ) : (
                        ''
                    )}
                    <div className="thank-you__left-panel">
                        <div className="thank-you__title-model-trim">
                            Vehicle Purchase Summary
                        </div>
                        <div className="thank-you__title-year-make">
                            {`${this.state.deal.year} ${this.state.deal
                                .make} ${this.state.deal.model} ${this.state
                                .deal.series} VIN#:${this.state.deal.vin}`}
                        </div>
                        <div className="thank-you__primary-image">
                            <img src={this.state.deal.photos[1].url} />
                        </div>
                        <div className="thank-you__left-panel-buttons">
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
                        </div>
                    </div>
                    <div className="thank-you__pricing">
                        <div className="thank-you__choice">
                            YOU CHOSE:{' '}
                            {this.youChoseString(this.state.purchase)}
                        </div>
                        <div className="thank-you__your-price-label">
                            YOUR OUT THE DOOR PRICE
                        </div>
                        <div className="thank-you__your-price">
                            {util.moneyFormat(this.state.purchase.dmr_price)}
                        </div>
                        <div className="thank-you__plate-fee">
                            (plate fee not included)
                        </div>
                        <div className="thank-you__hr" />
                        <div className="thank-you__msrp">
                            {util.moneyFormat(this.state.purchase.msrp)} MSRP
                        </div>
                        {this.state.availableRebates ? (
                            <div className="thank-you__rebates-applied">
                                {util.moneyFormat(
                                    R.sum(
                                        R.map(
                                            R.prop('value'),
                                            this.state.selectedRebates
                                        )
                                    )
                                )}{' '}
                                of{' '}
                                {util.moneyFormat(
                                    R.sum(
                                        R.map(
                                            R.prop('value'),
                                            this.state.availableRebates
                                        )
                                    )
                                )}{' '}
                                in rebates!
                            </div>
                        ) : (
                            'Loading'
                        )}
                        <div className="thank-you__hr thank-you__hr--full" />
                        <div className="thank-you__dealer-info">
                            <div className="thank-you__dealer-title">
                                Selling Dealer
                            </div>
                            <div>{this.state.deal.dealer_name}</div>
                            <div>
                                {this.state.deal.dealer.city},{' '}
                                {this.state.deal.dealer.state}
                            </div>
                            <div>
                                {this.state.deal.dealer.contact_name},{' '}
                                {this.state.deal.dealer.contact_title}
                            </div>
                            <div>{this.state.deal.dealer.phone}</div>
                        </div>
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

const mapStateToProps = state => {
    return {
        dealRebates: state.dealRebates,
        selectedRebates: state.selectedRebates,
    };
};

export default connect(mapStateToProps, Actions)(ThankYouPage);
