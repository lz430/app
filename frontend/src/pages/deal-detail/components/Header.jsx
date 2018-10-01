import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col } from 'reactstrap';
import strings from 'src/strings';
import DealStockNumber from 'components/Deals/DealStockNumber';
import { dealType } from 'types';

export default class Header extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
    };

    render() {
        return (
            <Row className="deal-details__header">
                <Col sm="6">
                    <div className="deal-details__title-year-make">
                        {strings.dealYearMake(this.props.deal)}
                    </div>
                    <div className="deal-details__title-model-trim">
                        {strings.dealModelTrim(this.props.deal)}
                    </div>
                </Col>
                <Col sm="6" className="deal-details__stock-number">
                    <DealStockNumber deal={this.props.deal} />
                </Col>
            </Row>
        );
    }
}
