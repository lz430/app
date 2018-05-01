import React from 'react';

class CustomizeQuoteOrBuyNowButton extends React.PureComponent {
    renderBuyNow() {
        return (
            <button
                onClick={() => ! this.props.disabled && this.props.onBuyNow(this.props.deal)}
                className="deal__button deal__button--small deal__button--pink deal__button"
                disabled={this.props.disabled}
            >
                Buy Now
            </button>
        )
    }

    renderCustomizeQuote() {
        return (
            <button
                onClick={() => this.props.onCustomizeQuote(this.props.deal)}
                className="deal__button deal__button--small deal__button--pink deal__button"
            >
                Customize Quote
            </button>
        )
    }

    render() {
        return this.props.hasCustomizedQuote ? this.renderBuyNow() : this.renderCustomizeQuote();
    }
}

CustomizeQuoteOrBuyNowButton.defaultProps = {
    onBuyNow: (deal) => (window.location = `/confirm/${deal.id}`),
    disabled: true
};

export default CustomizeQuoteOrBuyNowButton;