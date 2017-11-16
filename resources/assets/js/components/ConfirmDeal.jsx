import * as Actions from 'actions/index';
import { connect } from 'react-redux';
import fuelapi from 'src/fuelapi';
import miscicons from 'miscicons';
import Modal from 'components/Modal';
import R from 'ramda';
import React from 'react';
import strings from 'src/strings';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';

class ConfirmDeal extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            showStandardFeatures: false,
            showFeatures: false,
            fallbackDealImage: '/images/dmr-logo.svg',
            fuelFeaturedImage: null,
            warranties: null,
            dimensions: null,
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;

        if (this.props.deal.photos.length === 0) {
            this.requestFuelImages();
        }

        api
            .getDimensions(this.props.deal.versions[0].jato_vehicle_id)
            .then(response => {
                if (!this._isMounted) return;

                this.setState({
                    dimensions: response.data,
                });
            });

        api
            .getWarranties(this.props.deal.versions[0].jato_vehicle_id)
            .then(response => {
                if (!this._isMounted) return;

                this.setState({
                    warranties: response.data,
                });
        });
    }

    featuredImageUrl() {
        return R.propOr(
            R.propOr(
                this.state.fallbackDealImage,
                'url',
                this.state.fuelFeaturedImage
            ),
            'url',
            this.props.deal.photos[0]
        );
    }

    renderDealRebatesModal() {
        return (
            <Modal
                onClose={this.props.clearSelectedDeal}
                closeText="Back to results"
            >
                <CashFinanceLeaseCalculator />
            </Modal>
        );
    }

    hideModals() {
        this.setState({
            showStandardFeatures: false,
            showFeatures: false,
        });
    }

    renderStandardFeaturesModal(deal) {
        return (
            <Modal
                nowrapper={true}
                onClose={() => { this.hideModals() }}
            >
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
                    <div className="modal__body deal-details__modal-body">
                        <ul>
                            {deal.features.map((feature, index) => {
                                return <li key={index}>{feature.feature}</li>;
                            })}
                        </ul>
                    </div>
                </div>
            </Modal>
        );
    }

    renderFeaturesModal() {
        return (
            <Modal
                nowrapper={true}
                onClose={() => { this.hideModals() }}
            >

                <div className="modal__content">
                    <div className="modal__sticker-container">
                        <div className="modal__sticker">Additional Options</div>
                    </div>
                    <div className="modal__header">
                        <div className="modal__titles modal__titles--center">
                            <div className="modal__subtitle modal__subtitle--center">
                                {strings.dealYearMake(this.props.deal)}
                            </div>
                            <div className="modal__title modal_title--center">
                                {strings.dealModelTrim(this.props.deal)}
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
                    <div className="modal__body deal-details__modal-body">
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
                                <SVGInline svg={miscicons['loading']} />
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
                                <SVGInline svg={miscicons['loading']} />
                            )}
                        </ul>

                        <h3>Features</h3>
                        <hr />

                        <ul>
                            {this.props.deal.vauto_features.map(
                                (feature, index) => {
                                    return <li key={index}>{feature}</li>;
                                }
                            )}
                        </ul>
                    </div>
                </div>
            </Modal>
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

    render() {
        const deal = this.props.deal;
        const featuredImageUrl = this.featuredImageUrl();
        const featureImageClass =
            featuredImageUrl !== this.state.fallbackDealImage
                ? 'deal__image'
                : 'deal__image deal__image--fallback';

        return (
            <div>
                <div className="confirm-deal">
                    {this.props.hideImageAndTitle ? (
                        ''
                    ) : (
                        <div>
                            <div className="confirm-deal__basic-info">
                                <div
                                    className="confirm-deal__basic-info-year-and-model"
                                >
                                    <div className="confirm-deal__basic-info-year-and-make">
                                        {`${deal.year} ${deal.make}`}
                                    </div>

                                    <div className="confirm-deal__basic-info-model-and-series">
                                        {`${deal.model} ${deal.series}`}
                                    </div>
                                </div>
                            </div>

                            <img
                                className={featureImageClass}
                                src={featuredImageUrl}
                            />
                        </div>
                    )}
                    <div className="tabs__title">You Selected...</div>

                    <div className="confirm-deal__vehicle-info">
                        <div className="model-vin">
                            <p>
                                {`${deal.year} ${deal.make} ${deal.model} ${deal.series}`} <br />
                                {`Stock #${deal.vin}`}
                            </p>
                        </div>
                    </div>

                    <div className="confirm-deal__feature-buttons">
                        <button
                            onClick={() => this.showStandardFeatures(deal)}
                            className="confirm-deal__button confirm-deal__button--white confirm-deal__button--small"
                        >
                            Review Standard Features
                        </button>

                        <button
                            onClick={() => this.showFeatures(deal)}
                            className="confirm-deal__button confirm-deal__button--white confirm-deal__button--small"
                        >
                            Review Additional Options
                        </button>
                    </div>

                    <div className="confirm-deal__price">
                        <p className="confirm-deal__pricing-details">Pricing Details</p>
                        <p>{ `${this.props.selectedTab} Terms`}</p>

                        <div className="confirm-deal__prices">
                            <p>Suggested Retail: {`$${deal.msrp}`} <br />
                                Your Price: {`$${deal.supplier_price}*`}
                            </p>
                            <p>Rebates Applied:</p>
                            <p>
                                {`${this.props.selectedRebates} _______ in rebates available.`}
                                <a href="#">Get Rebates</a>
                            </p>
                        </div>

                        <hr />
                        <p className="confirm-deal__final-price">{`Your ${this.props.selectedTab} Price:`}</p>
                        <p className="confirm-deal__disclaimer">*Includes sales tax and dealer fees. License plate fees not included.</p>
                    </div>

                    {this.props.children}
                </div>
                {this.state.showStandardFeatures ? (
                    this.renderStandardFeaturesModal(deal)
                ) : (
                    ''
                )}
                {this.state.showFeatures ? this.renderFeaturesModal(deal) : ''}
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        compareList: state.compareList,
        selectedTab: state.selectedTab,
        downPayment: state.downPayment,
        dealRebates: state.dealRebates,
        selectedRebates: state.selectedRebates,
        termDuration: state.termDuration,
        fallbackDealImage: state.fallbackDealImage,
        selectedDeal: state.selectedDeal,
        isEmployee: state.isEmployee,
    };
};

export default connect(mapStateToProps, Actions)(ConfirmDeal);
