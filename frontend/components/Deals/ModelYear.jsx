import React from 'react';
import PropTypes from 'prop-types';
import { modelYearType } from '../../core/types';

import { moneyFormat } from '../../pricing/util';
import ModelYearImage from './ModelYearImage';
import { Card, CardBody, CardHeader, CardFooter } from 'reactstrap';

class ModelYear extends React.Component {
    static propTypes = {
        modelYear: modelYearType.isRequired,
        onSelectModelYear: PropTypes.func.isRequired,
        purchaseStrategy: PropTypes.string.isRequired,
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
        return (
            this.props.modelYear.year +
            '-' +
            this.props.modelYear.make +
            '-' +
            this.props.modelYear.model
        );
    }

    renderPrice() {
        let label = 'MSRP starting at';
        let value = moneyFormat(this.props.modelYear['msrp']);

        if (
            this.props.purchaseStrategy === 'lease' &&
            this.props.modelYear.payments.lease
        ) {
            label = 'Payments starting at';
            value = moneyFormat(this.props.modelYear.payments.lease.payment);
        }

        if (
            this.props.purchaseStrategy === 'finance' &&
            this.props.modelYear.payments.finance
        ) {
            label = 'Payments starting at';
            value = moneyFormat(this.props.modelYear.payments.finance.payment);
        }

        if (
            this.props.purchaseStrategy === 'cash' &&
            this.props.modelYear.payments.cash
        ) {
            label = 'Price starting at';
            value = moneyFormat(this.props.modelYear.payments.cash.payment);
        }

        return (
            <div className="price-summary">
                <div className="price-summary__price__label">{label}</div>
                <div className="price-summary__price__value">{value}</div>
            </div>
        );
    }

    render() {
        const modelYear = this.props.modelYear;

        return (
            <Card
                className="inventory-summary"
                onClick={() => {
                    this.selectModelYear(modelYear);
                }}
            >
                <CardHeader className="modelyear__header">
                    <div className="modelyear__name">
                        <div className="modelyear__basic-info-year-and-make">
                            {`${modelYear.year} ${modelYear.make}`}
                        </div>

                        <div className="modelyear__basic-info-model-and-series">
                            {`${modelYear.model}`}
                        </div>
                    </div>

                    <div className="modelyear__count">
                        {modelYear.deals} in stock
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
                        {this.renderPrice()}
                    </div>
                </CardBody>
                <CardFooter className="text-center">
                    <button
                        className="btn btn-outline-primary btn-sm"
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

export default ModelYear;
