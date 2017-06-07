import React from 'react';
import R from 'ramda';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';

class DealDetails extends React.Component {
    render() {
        const deal = this.props.deal;
        return (
            <div>
                <img
                    className="deal__image"
                    src={R.propOr(
                        this.props.fallbackDealImage,
                        'url',
                        deal.photos.data[0]
                    )}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        deal: state.selectedDeal,
        fallbackDealImage: state.fallbackDealImage,
    };
};

export default connect(mapStateToProps, Actions)(DealDetails);
