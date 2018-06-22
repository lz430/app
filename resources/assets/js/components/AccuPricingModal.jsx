import React from 'react';
import { hideAccuPricingModal } from 'actions/index';
import { connect } from 'react-redux';
import Modal from 'components/Modal';
import PropTypes from 'prop-types';

class AccuPricingModal extends React.PureComponent {
    static propTypes = {
        accuPricingModalIsShowing: PropTypes.bool,
        onHideAccuPricingModal: PropTypes.func.isRequired,
    };

    render() {
        return (
            <div>
                {this.props.accuPricingModalIsShowing && (
                    <div className="accupricing-modal-wrapper">
                        <Modal onClose={this.props.onHideAccuPricingModal}>
                            <div className="accupricing-modal">
                                <img
                                    src="/images/accupricing-logo.png"
                                    className="accupricing-modal__logo"
                                />
                                <p>
                                    Deliver My Ride <em>includes</em> all
                                    standard rebates, all taxes and all dealer
                                    fees in its pricing and payment quotes. When
                                    comparing to dealer or manufacturer
                                    advertised pricing, be sure to read all
                                    disclaimers. In most cases, advertised
                                    pricing <em>does not include</em> taxes and
                                    fees, but does include conditional or
                                    unrealistic rebates and significant cash due
                                    at signing. All payments assume good to
                                    excellent credit.
                                </p>
                            </div>
                        </Modal>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        accuPricingModalIsShowing: state.accuPricingModalIsShowing,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onHideAccuPricingModal: () => {
            return dispatch(hideAccuPricingModal);
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AccuPricingModal);
