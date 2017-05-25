import React from 'react'
import PropTypes from 'prop-types';
import Deal from './Deal'

class Deals extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const deals = this.props.deals;

        return <div className="deals">
            {deals.map((deal, index) => {
                return <Deal deal={deal} key={index}></Deal>
            })}
        </div>
    }
}

export default Deals;