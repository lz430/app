import React from 'react';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import Modal from 'components/Modal';
import DealPrice from 'components/DealPrice';
import strings from 'src/strings';
import api from 'src/api';

class ThankYouPage extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            showModal: true,
            purchase: null,
            deal: null,
            loading: true,
            warranties: null,
            dimensions: null,
            showStandardFeatures: false,
            showFeatures: false,
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;

        window.axios
            .get('/last-purchase')
            .then(data => {
                this.setState({
                    loading: false,
                    purchase: data.data.data.attributes,
                    deal: data.data.data.attributes.deal.data.attributes,
                });
            })
            .then(() => {
                api
                    .getDimensions(this.state.deal.versions[0].jato_vehicle_id)
                    .then(response => {
                        if (!this._isMounted) return;

                        this.setState({
                            dimensions: response.data,
                        });
                    });

                api
                    .getWarranties(this.state.deal.versions[0].jato_vehicle_id)
                    .then(response => {
                        if (!this._isMounted) return;

                        this.setState({
                            warranties: response.data,
                        });
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
                        {this.state.loading ? (
                            'Loading...'
                        ) : (
                            <img src={this.state.deal.photos[1].url} />
                        )}
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

    renderStandardFeaturesModal(deal) {
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

    render() {
        return (
            <div>
                {this.state.loading ? (
                    'Loading...'
                ) : (
                    <div className="thank-you">
                        {this.state.showModal ? (
                            this.renderNewPurchaseModal()
                        ) : (
                            ''
                        )}
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
                            <div className="thank-you__left-panel-title">
                                Vehicle Purchase Summary
                            </div>
                            <div className="thank-you__left-panel-subtitle">{`${this
                                .state.deal.year} ${this.state.deal.make} ${this
                                .state.deal.model} ${this.state.deal
                                .series} VIN#:${this.state.deal.vin}`}</div>
                            <div className="thank-you__left-panel-image">
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
                                <button className="thank-you__button thank-you__button--blue">
                                    Suggest Comparison
                                </button>
                            </div>
                        </div>
                        <div className="thank-you__right-panel">
                            <DealPrice deal={this.state.deal} />
                            <div>
                                YOU CHOSE:{' '}
                                {this.youChoseString(this.state.purchase)}
                            </div>
                            <div>
                                YOUR OUT OF THE DOOR PRICE{' '}
                                {this.state.purchase.dmr_price}
                            </div>
                            (plate fee not incleuded)
                            <hr />
                            <div>{this.state.purchase.msrp} MSRP</div>
                            <div>$8000 of $16000 in rebates!</div>
                            <div>
                                Selling Dealer
                                <hr />
                                {this.state.deal.dealer_name}
                            </div>
                            <div>
                                <h4>Items needed to finalize your purchase:</h4>
                                <hr />
                                <ul>
                                    <li>Driver’s License</li>
                                    <li>Certificate of Insurance</li>
                                    <ul>
                                        <li>
                                            Call your agent with vehicle details
                                            and VIN#
                                        </li>
                                    </ul>
                                    <li>
                                        Certified Check in the amount listed
                                        above.
                                    </li>
                                    <ul>
                                        <li>
                                            Dealer will calculate the license
                                            plate fee
                                        </li>
                                    </ul>
                                    <li>Registration</li>
                                    <ul>
                                        <li>
                                            Needed if transferring a valid
                                            license plate
                                        </li>
                                    </ul>
                                    <li>
                                        Proof of eligibility for selected
                                        rebates
                                    </li>
                                </ul>
                            </div>
                            <div>Questions about your purchase?</div>
                            <div>
                                <button>1</button>
                                <button>1</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        selectedRebates: state.selectedRebates,
    };
};

export default connect(mapStateToProps, Actions)(ThankYouPage);
