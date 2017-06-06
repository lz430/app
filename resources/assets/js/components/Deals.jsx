import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Deal from 'components/Deal';
import debounce from 'lodash.debounce';
import { connect } from 'react-redux';
import * as Actions from 'actions';

class Deals extends React.Component {
    componentDidMount() {
        const element = ReactDOM.findDOMNode(this);
        const subscribeToScroll = e => {
            this.props.requestMoreDeals();
        };

        element.addEventListener(
            'scroll',
            debounce(subscribeToScroll, 500, {
                maxWait: 1000,
                leading: true,
                trailing: false,
            })
        );
    }

    render() {
        return (
            <div className="deals">
                {this.props.deals.map((deal, index) => {
                    return (
                        <Deal
                            deal={deal}
                            key={index}
                            fallbackDealImage={this.props.fallbackDealImage}
                        />
                    );
                })}
            </div>
        );
    }
}

// Deals.propTypes = {
//     deals: PropTypes.arrayOf(
//         PropTypes.shape({
//             year: PropTypes.string.isRequired,
//             msrp: PropTypes.number.isRequired,
//             make: PropTypes.string.isRequired,
//             model: PropTypes.string.isRequired,
//             id: PropTypes.number.isRequired,
//         })
//     ),
//     fallbackDealImage: PropTypes.string.isRequired,
//     loadMoreDeals: PropTypes.func.isRequired,
// };

function mapStateToProps(state) {
    return {
        deals: state.deals,
        fallbackDealImage: state.fallbackDealImage,
    };
}

export default connect(mapStateToProps, Actions)(Deals);
