import React from 'react';

import Faqs from '../../../content/deal-faqs';
import FaqGroup from '../../../components/Deals/dealFaqGroup';

class ListGroupCollapse extends React.Component {
    state = {
        collapse: false,
        active: false,
        category: 'General Questions',
    };

    getFaqContent() {
        return Faqs.filter(item => item.category === this.state.category);
    }

    render() {
        return (
            <React.Fragment>
                <h3> Frequently Asked Questions </h3>
                <ul className="deal__faq__list">
                    {this.getFaqContent().map(item => (
                        <FaqGroup key={item.title} item={item} />
                    ))}
                </ul>
            </React.Fragment>
        );
    }
}

export default ListGroupCollapse;
