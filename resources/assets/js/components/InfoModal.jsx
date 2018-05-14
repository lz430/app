import InfoModalData from 'components/InfoModalData';
import React from 'react';
import R from 'ramda';
import zondicons from '../zondicons';
import SVGInline from 'react-svg-inline';

class InfoModal extends React.PureComponent {
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
                            {...R.pick(['deal', 'selectedTab', 'compareList', 'dealPricing'], this.props)}
                            {...R.pick([
                                'selectDeal',
                                'selectTab',
                                'requestTargets',
                                'requestBestOffer',
                                'getBestOffersForLoadedDeals',
                                'toggleCompare',
                                'showAccuPricingModal'
                            ], this.props)}
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
                {this.props.deal && this.props.infoModalIsShowingFor === this.props.deal.id ? this.renderModal() : ''}
            </div>
        );
    }
}

export default InfoModal;
