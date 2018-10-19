import React from 'react';
import { splitEvery } from 'ramda';
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    Card,
    CardBody,
} from 'reactstrap';

import {
    ExtraLargeAndUp,
    LargeAndDown,
} from '../../../../components/Responsive';

class ListTopMessaging extends React.PureComponent {
    state = {
        activeIndex: 0,
    };

    items = [
        {
            title: 'Skip the Dealership',
            content: 'buy or lease 100% online',
        },
        {
            title: 'All Real Inventory',
            content: 'from our local dealer partners',
        },
        {
            title: 'Free Delivery',
            content: 'to your home or office',
        },
        {
            title: '3-Day Return Policy',
            content: 'on all delivered vehicles',
        },
        {
            title: 'Transparent Pricing',
            content: 'no hidden taxes or fees',
        },
    ];

    onExiting() {
        this.animating = true;
    }

    onExited() {
        this.animating = false;
    }

    next() {
        const count = Math.ceil(this.items.length / 2);
        if (this.animating) {
            return;
        }
        const nextIndex =
            this.state.activeIndex === count - 1
                ? 0
                : this.state.activeIndex + 1;
        this.setState({ activeIndex: nextIndex });
    }

    previous() {
        if (this.animating) {
            return;
        }

        const count = Math.ceil(this.items.length / 2);

        const nextIndex =
            this.state.activeIndex === 0
                ? count - 1
                : this.state.activeIndex - 1;
        this.setState({ activeIndex: nextIndex });
    }

    renderCta(item) {
        return (
            <Card key={item.title} className="inventory-summary cta-message">
                <CardBody>
                    <div className="cta-message__content">
                        <h6>{item.title}</h6>
                        <p>{item.content}</p>
                    </div>
                </CardBody>
            </Card>
        );
    }

    renderSlides() {
        return splitEvery(2, this.items).map((group, index) => {
            return (
                <CarouselItem
                    onExiting={this.onExiting.bind(this)}
                    onExited={this.onExited.bind(this)}
                    key={index}
                >
                    {group.map(item => {
                        return this.renderCta(item, 'carousel');
                    })}
                </CarouselItem>
            );
        });
    }

    render() {
        const { activeIndex } = this.state;
        return (
            <div className="top-messaging">
                <ExtraLargeAndUp>
                    <div className="inventory-summary-deck inventory-messaging card-deck m-0">
                        {this.items.map(item => {
                            return this.renderCta(item, 'full');
                        })}
                    </div>
                </ExtraLargeAndUp>
                <LargeAndDown>
                    <Carousel
                        className="cta-message-carousel"
                        activeIndex={activeIndex}
                        next={this.next.bind(this)}
                        previous={this.previous.bind(this)}
                    >
                        {this.renderSlides()}
                        <CarouselControl
                            direction="prev"
                            directionText="Previous"
                            onClickHandler={this.previous.bind(this)}
                        />
                        <CarouselControl
                            direction="next"
                            directionText="Next"
                            onClickHandler={this.next.bind(this)}
                        />
                    </Carousel>
                </LargeAndDown>
            </div>
        );
    }
}

export default ListTopMessaging;
