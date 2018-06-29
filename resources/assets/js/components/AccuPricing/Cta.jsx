import React from 'react';

import { showAccuPricingModal } from 'apps/common/actions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from './Modal';

class Cta extends React.PureComponent {
    static propTypes = {
        onShowAccuPricingModal: PropTypes.func.isRequired,
    };

    render() {
        return (
            <div>
                <div className="accupricing-cta accupricing-cta--horizontal">
                    <a>
                        <img
                            src="/images/accupricing-logo.png"
                            className="accupricing-cta__logo"
                        />
                    </a>
                    <p className="accupricing-cta__disclaimer">
                        * Includes taxes, dealer fees and rebates.
                    </p>
                </div>
                <Modal />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        onShowAccuPricingModal: () => {
            return dispatch(showAccuPricingModal());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Cta);
