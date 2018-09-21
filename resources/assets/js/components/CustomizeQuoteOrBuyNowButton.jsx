import React from 'react';

class CustomizeQuoteOrBuyNowButton extends React.PureComponent {
    static defaultProps = {
        onBuyNow: deal => (window.location = `/confirm/${deal.id}`),
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

    renderCustomizeQuote() {
        return (
            <button
                onClick={() => this.props.onCustomizeQuote(this.props.deal)}
                className="btn btn-success"
            >
                Customize This Deal
            </button>
        );
    }

    render() {
        return this.props.hasCustomizedQuote
            ? this.renderBuyNow()
            : this.renderCustomizeQuote();
    }
}

export default CustomizeQuoteOrBuyNowButton;
