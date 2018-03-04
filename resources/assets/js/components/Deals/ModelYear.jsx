import React from 'react';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import PropTypes from 'prop-types';
import R from 'ramda';
import util from 'src/util';
import Deal from 'components/Deals/Deal';
import ModelYearImage from 'components/Deals/ModelYearImage';
import DealPrice from 'components/Deals/DealPrice';

class ModelYear extends React.PureComponent {
    selectModelYear(modelYear) {
        this.props.selectModelYear(modelYear);
    }

    render() {
        const modelYear = this.props.modelYear;
        return (
            <div className="deal">
                {
                    this.props.hideImageAndTitle ? ('') : (
                        <div>
                            <div className="deal__basic-info">
                                <div className="deal__basic-info-year-and-model">
                                    <div className="deal__basic-info-year-and-make">
                                        {`${modelYear.year} ${modelYear.make}`}
                                    </div>

                                    <div className="deal__basic-info-model-and-series">
                                        {`${modelYear.model}`}
                                    </div>
                                </div>
                            </div>

                            <ModelYearImage modelYear={modelYear} />

                            <div className="dealGroup__count">{ modelYear.deals.count } in stock.</div>

                            <div className="dealGroup__price">
                                <span className="dealGroup__price-label">MSRP Starting at</span> ${modelYear.lowest_msrp}
                            </div>

                            <button className="deal__button deal__button--small deal__button--pink deal__button"
                                onClick={ () => {this.selectModelYear(modelYear) }}>
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

ModelYear.PropTypes = {
    deal: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, Actions)(ModelYear);
