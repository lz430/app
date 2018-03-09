import React from 'react';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import PropTypes from 'prop-types';
import R from 'ramda';
import util from 'src/util';
import ModelYearImage from 'components/Deals/ModelYearImage';

class ModelYear extends React.PureComponent {
    selectModelYear(modelYear) {
        this.props.selectModelYear(modelYear);
    }

    render() {
        const modelYear = this.props.modelYear;
        return (
            <div className="modelyear">
                {
                    this.props.hideImageAndTitle ? ('') : (
                        <div>
                            <div className="modelyear__basic-info">
                                <div className="modelyear__basic-info-year-and-model">
                                    <div className="modelyear__basic-info-year-and-make">
                                        {`${modelYear.year} ${modelYear.make}`}
                                    </div>

                                    <div className="modelyear__basic-info-model-and-series">
                                        {`${modelYear.model}`}
                                    </div>
                                </div>
                            </div>

                            <ModelYearImage modelYear={modelYear} />

                            <div className="modelyear__details">
                                <div className="modelyear__count">{ modelYear.deals.count } in stock.</div>

                                <div className="modelyear__price">
                                    <span className="modelyear__price-label">MSRP starts at</span> { util.moneyFormat(modelYear.lowest_msrp) }
                                </div>
                            </div>

                            <div className="modelyear__buttons">
                                <button className="modelyear__button modelyear__button--small modelyear__button--pink modelyear__button"
                                    onClick={ () => {this.selectModelYear(modelYear) }}>
                                    View Inventory
                                </button>
                            </div>
                                
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
    modelyear: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, Actions)(ModelYear);
