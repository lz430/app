import React from 'react';
import PropTypes from 'prop-types';

import { checkoutType } from '../../types';

class BackButton extends React.PureComponent {
    static propTypes = {
        currentPage: PropTypes.string,
        isCurrentPageInCheckout: PropTypes.bool,
        checkout: checkoutType,
    };

    /**
     * If we're on the deal list && showing models we just clear the filters,
     * similar to the return to original search button.
     *
     * If we're on the deal detail page, we go back to the search results.
     *
     * If we're on the compare page, since users can come to the compare page from
     * the deal search as well as the deal detail, and it could be any random deal page,
     * we just attempt to let the browser handle this.
     *
     * If we're on the confirmation page we allow the user to go back to the deal.
     *
     */
    handleBackButton() {
        if (this.props.currentPage === 'checkout-confirm') {
            window.location = `/deals/${this.props.checkout.deal.id}`;
        }
    }

    render() {
        //
        // Don't show if in checkout and no checkout.
        if (
            this.props.isCurrentPageInCheckout &&
            !this.props.checkout.deal.id
        ) {
            return false;
        }

        //
        // Don't show on checkout complete
        if (this.props.currentPage === 'checkout-financing') {
            return false;
        }

        //
        // Don't show on checkout complete
        if (this.props.currentPage === 'checkout-complete') {
            return false;
        }

        return <span onClick={e => this.handleBackButton(e)}>&lt; BACK</span>;
    }
}

export default BackButton;
