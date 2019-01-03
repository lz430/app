import React from 'react';
import { Row, Col } from 'reactstrap';

export default class extends React.PureComponent {
    state = {
        collapse: false,
        active: false,
    };

    render() {
        const { deal } = this.props;
        console.log(this.vehicle);
        return (
            <React.Fragment>
                {this.props.values.map(item => (
                    <Row className="deal-details__specs accordion-body">
                        <Col
                            sm="6"
                            className="deal-details__specs capabilities text-left"
                        >
                            <span>{item.label} </span>
                        </Col>
                        <Col
                            sm="6"
                            className="deal-details__specs features text-center"
                        >
                            <span>{item.value} </span>
                        </Col>
                    </Row>
                ))}
            </React.Fragment>
        );
    }
}
