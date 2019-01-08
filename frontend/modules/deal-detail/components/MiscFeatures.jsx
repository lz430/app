import React from 'react';
import { Row, Col, Container } from 'reactstrap';
import { dealType } from '../../../core/types';

export default class AdditionalInformation extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
    };

    render() {
        if (this.props.deal.vauto_features.length === 0) {
            return false;
        }

        return (
            <div className="pb-5 pt-5">
                <Container>
                    <Row className="deal__section-heading">
                        <Col>
                            <h3 className="text-center">
                                {' '}
                                Additional Information{' '}
                            </h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="bg-white rounded text-sm p-3 shadow-sm">
                                <ul className="deal__misc text-sm">
                                    {this.props.deal.vauto_features.map(
                                        (item, index) => {
                                            return (
                                                <li key={`misc-${index}`}>
                                                    {item}
                                                </li>
                                            );
                                        }
                                    )}
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
