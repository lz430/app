import React from 'react';
import { dealType } from '../../../core/types';
import DealColors from '../../../components/Deals/DealColors';
import { Row, Col } from 'reactstrap';
import { Sticky } from 'react-sticky';

import { MediumAndUp, SmallAndDown } from '../../../components/Responsive';

export default class extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
    };

    render() {
        // console.log(this.props);
        return (
            <div className="deal__highlights">
                <Sticky topOffset={533}>
                    {({ style, isSticky }) => (
                        <div
                            className="deal-highlights fixed"
                            style={{
                                ...style,
                                marginTop: isSticky ? '145px' : '0px',
                            }}
                        >
                            <Row>
                                <Col className="highlights__anchors">
                                    <ul className="d-flex align-items-center mb-0">
                                        <li className="d-inline-flex">
                                            <a
                                                className="d-block border-right"
                                                href="#overview"
                                            >
                                                Overview
                                            </a>
                                        </li>
                                        <li className="d-inline-flex">
                                            <a
                                                className="d-block border-right"
                                                href="#gallery"
                                            >
                                                Gallery
                                            </a>
                                        </li>
                                        <li className="d-inline-flex">
                                            <a
                                                className="d-block border-right"
                                                href="#specs"
                                            >
                                                Specifications
                                            </a>
                                        </li>
                                        <li className="d-inline-flex">
                                            <a
                                                className="d-block border-right"
                                                href="#ourPromise"
                                            >
                                                Our Promise
                                            </a>
                                        </li>
                                        <li className="d-inline-flex">
                                            <a href="#faqs">Faqs</a>
                                        </li>
                                    </ul>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Sticky>
            </div>
        );
    }
}
