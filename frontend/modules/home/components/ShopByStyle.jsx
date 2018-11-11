import React from 'react';

import { Container, Row, Col } from 'reactstrap';
import Link from 'next/link';

import styles from '../../../content/styles';
import StyleIcon from '../../../components/Deals/StyleIcon';

import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

export default class extends React.Component {
    responsive = {
        0: { items: 2 },
        600: { items: 3 },
        1024: { items: 4 },
    };

    state = {
        items: [],
    };

    renderStyle(style) {
        const query = {
            entity: 'model',
            sort: 'payment',
            purchaseStrategy: 'finance',
            filters: style.query,
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
                        <a className="cta">See All</a>
                    </div>
                </Col>
            </Link>
        );
    }
    render() {
        const { responsive, currentIndex } = this.state;

        return (
            <Container className="callout__categories">
                <AliceCarousel
                    ref={el => (this.Carousel = el)}
                    duration={400}
                    autoPlay={false}
                    startIndex={1}
                    fadeOutAnimation={true}
                    mouseDragEnabled={true}
                    playButtonEnabled={false}
                    autoPlayInterval={2000}
                    autoPlayDirection="rtl"
                    responsive={this.responsive}
                    disableAutoPlayOnAction={true}
                    onSlideChange={this.onSlideChange}
                    onSlideChanged={this.onSlideChanged}
                    dotsDisabled={true}
                >
                    {styles.map(style => this.renderStyle(style))}
                </AliceCarousel>
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
