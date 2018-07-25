import React from 'react';

import InfoModalData from 'components/InfoModalData';

import * as R from 'ramda';
import zondicons from '../zondicons';
import SVGInline from 'react-svg-inline';
import PropTypes from 'prop-types';
import { dealType } from '../types';

class InfoModal extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
        infoModalIsShowingFor: PropTypes.number,
        withPricingTabs: PropTypes.bool,
        userLocation: PropTypes.object.isRequired,
        purchaseStrategy: PropTypes.string.isRequired,
        showInfoModal: PropTypes.func.isRequired,
        hideInfoModal: PropTypes.func.isRequired,
        onRequestDealQuote: PropTypes.func.isRequired,
        onSetPurchaseStrategy: PropTypes.func.isRequired,
    };

    static defaultProps = {
        withPricingTabs: true,
    };

    renderModal() {
        return (
            <div className="modal" onClick={e => this.closeIfOverlayClick(e)}>
                <div className="modal__overlay" />
                <div className="modal__wrapper">
                    <div className="modal__content">
                        <div className="modal__close--info">
                            <SVGInline
                                onClick={this.props.hideInfoModal}
                                height="20px"
                                width="20px"
                                className="modal__close-x--info"
                                svg={zondicons['close']}
                            />
                        </div>
                        <InfoModalData
                            closeModal={() => this.props.hideInfoModal()}
                            deal={this.props.deal}
                            userLocation={this.props.userLocation}
                            purchaseStrategy={this.props.purchaseStrategy}
                            dealPricing={this.props.dealPricing}
                            onRequestDealQuote={this.props.onRequestDealQuote}
                            onSetPurchaseStrategy={
                                this.props.onSetPurchaseStrategy
                            }
                            compareList={this.props.compareList}
                            selectDeal={this.props.selectDeal}
                            toggleCompare={this.props.toggleCompare}
                            withPricingTabs={this.props.withPricingTabs}
                        />
                    </div>
                </div>
            </div>
        );
    }

    closeIfOverlayClick(e) {
        const targetClass = e.target.getAttribute('class');

        if (
            R.contains(targetClass, 'modal__wrapper') ||
            R.contains(targetClass, 'modal__overlay')
        ) {
            this.props.hideInfoModal();
        }
    }

    render() {
        return (
            <div className="infomodal__context">
                <a
                    onClick={() => this.props.showInfoModal(this.props.deal.id)}
                    className="link infomodal__button"
                >
                    <SVGInline
                        width="15px"
                        fill="grey"
                        svg={zondicons['information-outline']}
                    />
                </a>
                {this.props.deal &&
                this.props.infoModalIsShowingFor === this.props.deal.id
                    ? this.renderModal()
                    : ''}
            </div>
        );
    }
}

export default InfoModal;
