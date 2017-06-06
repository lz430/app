import React from 'react';
import R from 'ramda';
import util from 'src/util';

class Deal extends React.Component {
    render() {
        const deal = this.props.deal;
        return (
            <div className="deal">
                <img
                    className="deal__image"
                    src={R.propOr(
                        this.props.fallbackDealImage,
                        'url',
                        deal.photos.data[0]
                    )}
                />

                <div className="deal__basic-info">
                    <p>
                        <a
                            href={`apply-or-purchase?deal_id=${deal.id}`}
                        >{`${deal.year} ${deal.make} ${deal.model}`}</a>
                        <br />
                        <strong>{util.moneyFormat(deal.price)}</strong>
                    </p>
                </div>

                <div className="deal__buttons">
                    <button className="deal__button deal__button--small deal__button--blue deal__button">
                        Details
                    </button>
                    <button className="deal__button deal__button--small">
                        Compare
                    </button>
                </div>
            </div>
        );
    }
}

export default Deal;
