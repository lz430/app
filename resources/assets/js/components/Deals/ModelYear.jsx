import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import util from 'src/util';
import ModelYearImage from 'components/Deals/ModelYearImage';
import { selectModelYear } from 'pages/deal-list/actions';
import { Card, CardBody, CardHeader, CardFooter } from 'reactstrap';

class ModelYear extends React.Component {
    static propTypes = {
        modelYear: PropTypes.object.isRequired,
        onSelectModelYear: PropTypes.func.isRequired,
        children: PropTypes.node,
    };

    shouldComponentUpdate(nextProps) {
        return nextProps.modelYear !== this.props.modelYear;
    }

    /**
     * When selecting model year we have to:
     *
     * 1) Set the year
     * 2) Set the model
     * 3) Set the entity to 'deal'
     * 4) Perform search
     * @param modelYear
     */
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
            <Card className="inventory-summary">
                <CardHeader>
                    <div
                        className="modelyear__basic-info"
                        onClick={() => {
                            this.selectModelYear(modelYear);
                        }}
                    >
                        <div className="modelyear__basic-info-year-and-model">
                            <div className="modelyear__basic-info-year-and-make">
                                {`${modelYear.year} ${modelYear.make}`}
                            </div>

                            <div className="modelyear__basic-info-model-and-series">
                                {`${modelYear.model}`}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    <ModelYearImage
                        modelYear={modelYear}
                        key={this.buildModelKey()}
                        selectModelYear={() => {
                            this.selectModelYear(modelYear);
                        }}
                    />
                    <div className="modelyear__details">
                        <div className="modelyear__count">
                            {modelYear.deals.count} in stock.
                        </div>

                        <div className="modelyear__price">
                            <span className="modelyear__price-label">
                                MSRP starts at
                            </span>{' '}
                            {util.moneyFormat(modelYear['lowest_msrp'])}
                        </div>
                    </div>
                </CardBody>
                <CardFooter>
                    <button
                        className="btn btn-success btn-block"
                        onClick={() => {
                            this.selectModelYear(modelYear);
                        }}
                    >
                        View Inventory
                    </button>
                </CardFooter>
            </Card>
        );
    }
}

const mapStateToProps = state => {
    return {};
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
