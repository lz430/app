import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col } from 'reactstrap';
import strings from 'src/strings';
import DealStockNumber from 'components/Deals/DealStockNumber';

export default class Header extends React.PureComponent {
    static propTypes = {
        deal: PropTypes.object.isRequired,
    };

    render() {
        return (
            <Row>
                <Col>
                    <div className="deal-details__title-year-make">
                        {strings.dealYearMake(this.props.deal)}
                    </div>
                    <div className="deal-details__title-model-trim">
                        {strings.dealModelTrim(this.props.deal)}
                    </div>
                </Col>
                <Col className="d-none d-sm-block">
                    <div className="deal-details__stock-number">
                        <DealStockNumber deal={this.props.deal} />
                    </div>
                </Col>
            </Row>
        );
    }
}
