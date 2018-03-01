import React from 'react';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import PropTypes from 'prop-types';
import R from 'ramda';
import util from 'src/util';
import Deal from 'components/Deals/Deal';
import DealImage from 'components/Deals/DealImage';
import DealPrice from 'components/Deals/DealPrice';

class DealGrouping extends React.PureComponent {
    render() {
        const dealGrouping = this.props.dealGrouping;
        return (
            <div className="deal">
                {
                    this.props.hideImageAndTitle ? ('') : (
                        <div>
                            <div className="deal__basic-info">
                                <div className="deal__basic-info-year-and-model">
                                    <div className="deal__basic-info-year-and-make">
                                        {`${dealGrouping.year} ${dealGrouping.make}`}
                                    </div>

                                    <div className="deal__basic-info-model-and-series">
                                        {`${dealGrouping.model}`}
                                    </div>
                                </div>
                            </div>

                            

                            <div className="dealGroup__count">{ dealGrouping.deals.count } in stock.</div>

                            <div className="dealGroup__price">
                                <span className="dealGroup__price-label">MSRP Starting at</span> ${dealGrouping.lowest_msrp}
                            </div>

                            <button className="deal__button deal__button--small deal__button--pink deal__button"
                                onClick={ () => {this.props.drillDownDealsToModel(dealGrouping) }}>
                                View Details
                            </button>
                                
                        </div>
                    )
                }
                {this.props.children}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        compareList: state.compareList,
        zipcode: state.zipcode,
        bestOffers: state.bestOffers,
        selectedTab: state.selectedTab,
        targets: state.targets,
        targetDefaults: state.targetDefaults,
    };
};

DealGrouping.PropTypes = {
    deal: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, Actions)(DealGrouping);
