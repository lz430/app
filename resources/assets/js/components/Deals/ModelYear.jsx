import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import util from 'src/util';
import ModelYearImage from 'components/Deals/ModelYearImage';
import { selectModelYear } from 'actions/index';

class ModelYear extends React.PureComponent {
    static propTypes = {
        modelYear: PropTypes.object.isRequired,
        onSelectModelYear: PropTypes.func.isRequired,
    };

    shouldComponentUpdate(nextProps) {
        return nextProps.modelYear !== this.props.modelYear;
    }

    selectModelYear(modelYear) {
        this.props.onSelectModelYear(modelYear);
    }

    /**
     * @returns {string}
     */
    buildModelKey() {
        return this.props.modelYear.year + '--' + this.props.modelYear.id;
    }

    render() {
        const modelYear = this.props.modelYear;
        return (
            <div className="modelyear">
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

                    <ModelYearImage
                        modelYear={modelYear}
                        key={this.buildModelKey()}
                    />

                    <div className="modelyear__details">
                        <div className="modelyear__count">
                            {modelYear.deals.count} in stock.
                        </div>

                        <div className="modelyear__price">
                            <span className="modelyear__price-label">
                                MSRP starts at
                            </span>{' '}
                            {util.moneyFormat(modelYear.lowest_msrp)}
                        </div>
                    </div>

                    <div className="modelyear__buttons">
                        <button
                            className="modelyear__button modelyear__button--small modelyear__button--pink modelyear__button"
                            onClick={() => {
                                this.selectModelYear(modelYear);
                            }}
                        >
                            View Inventory
                        </button>
                    </div>
                </div>
                {this.props.children}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        compareList: state.common.compareList,
        zipcode: state.common.zipcode,
        bestOffers: state.common.bestOffers,
        selectedTab: state.common.selectedTab,
        targets: state.common.targets,
        targetDefaults: state.common.targetDefaults,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSelectModelYear: modelYear => {
            return dispatch(selectModelYear(modelYear));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModelYear);
