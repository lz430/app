import React from 'react';
import R from 'ramda';
import util from '../src/util'

class Deal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const deal = this.props.deal;
        return (
            <div className="deal">
                <div className="deal__basic-info">
                    <p>{`${deal.year} ${deal.make} ${deal.model}`}
                        <br />
                        <strong>{util.moneyFormat(deal.price)}</strong>
                    </p>
                </div>
                <img
                    className="deal__image"
                    src={R.propOr(this.props.fallbackDealImage, 'url', deal.photos.data[0])}
                />
                <div className="deal__buttons">
                    <button className="button">Details</button>
                    <button className="button">Compare</button>
                </div>

            </div>
        );
    }
}

export default Deal;
