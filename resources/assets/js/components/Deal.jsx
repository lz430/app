import React from 'react';
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
                        <strong>{util.moneyFormat(deal.msrp)} MSRP</strong>
                    </p>
                </div>
                <img
                    className="deal__image"
                    src={deal.photos.data[0].url}
                />
                <div className="deal__buttons">
                    <button>Details</button>
                    <button>Compare</button>
                </div>

            </div>
        );
    }
}

export default Deal;
