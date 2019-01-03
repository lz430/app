import React from 'react';
import { Row, Col } from 'reactstrap';

export default class extends React.PureComponent {
    state = {
        collapse: false,
        active: false,
    };

    render() {
        const { deal } = this.props;
        return (
            <React.Fragment>
                <Row className="deal-details__specs accordion-body">
                    <Col
                        sm="6"
                        className="deal-details__specs capabilities text-left"
                    >
                        <span />
                    </Col>
                    <Col
                        sm="6"
                        className="deal-details__specs features text-center"
                    >
                        <span />
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}
