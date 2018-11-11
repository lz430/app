import React from 'react';

import {
    Container,
    Row,
    Col,
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption,
} from 'reactstrap';
import Link from 'next/link';

import makes from '../../../content/makes';

export default class extends React.Component {
    renderMake(make) {
        const query = {
            entity: 'model',
            sort: 'payment',
            purchaseStrategy: 'finance',
            filters: make.query,
        };

        return (
            <Col className="mb-3">
                <Link
                    key={make.title}
                    href={{ pathname: '/deal-list', query: query }}
                    as={{ pathname: '/filter', query: query }}
                    passHref
                >
                    <a>
                        <img
                            style={{ height: '80px', width: '80px' }}
                            src={make.logo}
                            alt={make.title + ' logo'}
                        />
                    </a>
                </Link>
            </Col>
        );
    }

    render() {
        return (
            <div className="container-fluid callout__brands">
                <Container>
                    <Row>{makes.map(make => this.renderMake(make))}</Row>
                </Container>
            </div>
        );
    }
}
