import React from "react";
import * as Actions from 'actions/index';
import {connect} from "react-redux";
import Modal from 'components/Modal';

class AccuPricingModal extends React.PureComponent {
    render() {
        return (
            <div>
                {this.props.accuPricingModalIsShowing &&
                    <Modal onClose={this.props.hideAccuPricingModal}>
                        <div className="accupricing-modal">
                            <img src="/images/accupricing-logo.png" className="accupricing-modal__logo"/>
                            <p>
                                Deliver My Ride <em>includes</em> all standard rebates, all taxes and all dealer fees
                                in its pricing and payment quotes. When comparing to dealer or manufacturer
                                advertised pricing, be sure to read all disclaimers. In most cases,
                                advertised pricing <em>does not include</em> taxes and fees, but
                                does include conditional or unrealistic rebates and significant
                                cash due at signing. All payments assume good to
                                excellent credit.
                            </p>
                        </div>
                    </Modal>
                }
            </div>
        )
    }
}

const makeMapStateToProps = () => {
    return (state, props) => {
        return {
            accuPricingModalIsShowing: state.accuPricingModalIsShowing,
        };
    };
};

export default connect(makeMapStateToProps, Actions)(AccuPricingModal);
