import React from 'react';

import Faqs from '../../../content/faqs';
import FaqGroup from '../../../components/Deals/dealFaqGroup';

class ListGroupCollapse extends React.Component {
    state = {
        category: 'Deal FAQ',
        activeFaqKey: false,
    };

    toggleActiveFaq(faqKey) {
        // If the user clicks on the open faq, close all faqss
        if (faqKey === this.state.activeFaqKey) {
            this.setState({
                activeFaqKey: false,
            });
        } else {
            this.setState({
                activeFaqKey: faqKey,
            });
        }
    }

    getFaqContent() {
        return Faqs.filter(item => item.category === this.state.category);
    }

    render() {
        return (
            <React.Fragment>
                <h5> Frequently Asked Questions </h5>
                <ul className="deal__faq__list bg-white">
                    {this.getFaqContent().map(item => (
                        <FaqGroup
                            key={item.title}
                            item={item}
                            isOpen={this.state.activeFaqKey === item.title}
                            onToggle={this.toggleActiveFaq.bind(this)}
                        />
                    ))}
                </ul>
            </React.Fragment>
        );
    }
}

export default ListGroupCollapse;
