import React from 'react'

class Deal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const deal = this.props.deal;
        return <div className="deal-container">
            <p>price</p>
            <p>{deal.attributes.price}</p>
            <p>year</p>
            <p>{deal.attributes.year}</p>
            <p>make</p>
            <p>{deal.attributes.make}</p>
            <p>model</p>
            <p>{deal.attributes.model}</p>
            <p>vin</p>
            <p>{deal.attributes.vin}</p>
            <p>color</p>
            <p>{deal.attributes.color}</p>
            <p>certified</p>
            <p>{deal.attributes.certified}</p>
        </div>
    }
}

export default Deal;