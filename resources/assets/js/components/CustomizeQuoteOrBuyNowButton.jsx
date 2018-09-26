import React from 'react';

class CustomizeQuoteOrBuyNowButton extends React.PureComponent {
    static defaultProps = {
        onBuyNow: deal => (window.location = `/checkout/confirm`),
        disabled: true,
    };

    renderBuyNow() {
        return (
            <button
                onClick={() =>
                    !this.props.disabled && this.props.onBuyNow(this.props.deal)
                }
                className="btn btn-success"
                disabled={this.props.disabled}
            >
                Buy Now
            </button>
        );
    }

    render() {
        return this.renderBuyNow();
    }
}

export default CustomizeQuoteOrBuyNowButton;
