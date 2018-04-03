import InfoModalData from 'components/InfoModalData';
import React from 'react';
import R from 'ramda';
import zondicons from '../zondicons';
import SVGInline from 'react-svg-inline';

class InfoModal extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            toggled: false,
        };
    }

    renderModal() {
        return (
            <div className="modal" onClick={e => this.closeIfOverlayClick(e)}>
                <div className="modal__overlay" />
                <div className="modal__wrapper">
                    <div className="modal__content">
                        <InfoModalData
                            closeModal={() => this.toggleModal()}
                            {...R.pick(['deal', 'selectedTab', 'compareList', 'dealPricing'], this.props)}
                            {...R.pick([
                                'selectDeal',
                                'selectTab',
                                'requestTargets',
                                'requestBestOffer',
                                'getBestOffersForLoadedDeals',
                                'toggleCompare'
                            ], this.props)}
                        />
                    </div>
                </div>
            </div>
        );
    }

    toggleModal() {
        this.setState({ toggled: !this.state.toggled });
    }

    closeIfOverlayClick(e) {
        const targetClass = e.target.getAttribute('class');

        if (
            R.contains(targetClass, 'modal__wrapper') ||
            R.contains(targetClass, 'modal__overlay')
        ) {
            this.toggleModal();
        }
    }

    render() {
        return (
            <div className="infomodal__context">
                <a
                    onClick={() => this.toggleModal()}
                    className="link infomodal__button"
                >
                    <SVGInline
                        width="15px"
                        fill="grey"
                        svg={zondicons['information-outline']}
                    />
                </a>
                {this.state.toggled ? this.renderModal() : ''}
            </div>
        );
    }
}

export default InfoModal;
