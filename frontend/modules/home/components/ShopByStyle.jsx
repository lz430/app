import React from 'react';

import { Container, Row, Col } from 'reactstrap';
import Link from 'next/link';

import styles from '../../../content/styles';
import StyleIcon from '../../../components/Deals/StyleIcon';

export default class extends React.Component {
    renderStyle(style) {
        const query = {
            entity: 'model',
            sort: 'payment',
            filters: style.query,
            purchaseStrategy: 'finance',
        };

        return (
            <Link
                key={style.title}
                href={{ pathname: '/deal-list', query: query }}
                as={{ pathname: '/filter', query: query }}
                passHref
            >
                <Col className="__category m-2 text-center">
                    <h3>{style.title}</h3>
                    <div className="icon">
                        <StyleIcon style={style.value} size="large" />
                    </div>
                    <div>
                        <a>See All</a>
                    </div>
                </Col>
            </Link>
        );
    }

    render() {
        return (
            <Container className="callout__categories">
                <Row>{styles.map(style => this.renderStyle(style))}</Row>
                <Row>
                    <Col className="text-center mt-5">
                        <Link href="/deal-list" as="/filter" passHref>
                            <a className="btn btn-primary">Browse All Cars</a>
                        </Link>
                    </Col>
                </Row>
            </Container>
        );
    }
}
