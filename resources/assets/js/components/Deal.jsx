import React from 'react'

class Deal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const deal = this.props.deal;
        return <div className="deal">
            <div className="deal__basic-info">
                <p>2018 Toyota<br/>4 Runner Sports Utility Vehicle<br /><strong>$34,000 MSRP</strong></p>
            </div>
            <img className="deal__image" src="https://vehiclephotos.vauto.com/a0/4f/0f/99-47aa-4260-a37f-0d027f5713e4/image-1.jpg" />
            <div className="deal__buttons">
                <button>Details</button>
                <button>Compare</button>
            </div>

        </div>
    }
}

export default Deal;