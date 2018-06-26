import React from 'react';

import InfoModalData from 'components/InfoModalData';

import R from 'ramda';
import zondicons from '../zondicons';
import SVGInline from 'react-svg-inline';
import PropTypes from 'prop-types';

class InfoModal extends React.PureComponent {
    static propTypes = {
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
        infoModalIsShowingFor: PropTypes.number,
        showInfoModal: PropTypes.func.isRequired,
        hideInfoModal: PropTypes.func.isRequired,
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
                            selectedTab={this.props.selectedTab}
                            compareList={this.props.compareList}
                            dealPricing={this.props.dealPricing}
                            selectDeal={this.props.selectDeal}
                            selectTab={this.props.selectTab}
                            requestTargets={this.props.requestTargets}
                            requestBestOffer={this.props.requestBestOffer}
                            getBestOffersForLoadedDeals={
                                this.props.getBestOffersForLoadedDeals
                            }
                            toggleCompare={this.props.toggleCompare}
                            showAccuPricingModal={
                                this.props.showAccuPricingModal
                            }
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
