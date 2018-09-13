import React from 'react';
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    Card,
    CardBody,
} from 'reactstrap';

import Phone from 'icons/zondicons/Phone';
import { ExtraLargeAndUp, LargeAndDown } from 'components/Responsive';

class ListTopMessaging extends React.PureComponent {
    state = {
        activeIndex: 0,
    };

    items = [
        {
            title: 'Transparent Pricing',
            content:
                "Can't find what you're looking for? Questions about trade in?",
        },
        {
            title: 'Free Delivery To You',
            content:
                "Can't find what you're looking for? Questions about trade in?",
        },
        {
            title: 'Message A',
            content:
                "Can't find what you're looking for? Questions about trade in?",
        },
        {
            title: 'Message B',
            content:
                "Can't find what you're looking for? Questions about trade in?",
        },
    ];

    onExiting() {
        this.animating = true;
    }

    onExited() {
        this.animating = false;
    }

    next() {
        if (this.animating) return;
        const nextIndex =
            this.state.activeIndex === this.items.length - 1
                ? 0
                : this.state.activeIndex + 1;
        this.setState({ activeIndex: nextIndex });
    }

    previous() {
        if (this.animating) return;
        const nextIndex =
            this.state.activeIndex === 0
                ? this.items.length - 1
                : this.state.activeIndex - 1;
        this.setState({ activeIndex: nextIndex });
    }

    renderCta(item, style) {
        return (
            <Card key={item.title} className="inventory-summary cta-message">
                <CardBody>
                    <div className="cta-message__icon">
                        <Phone />
                    </div>
                    <div className="cta-message__content">
                        <h6>{item.title}</h6>
                        <p>{item.content}</p>
                    </div>
                </CardBody>
            </Card>
        );
    }

    renderSlides() {
        return this.items.map(item => {
            return (
                <CarouselItem
                    onExiting={this.onExiting.bind(this)}
                    onExited={this.onExited.bind(this)}
                    key={item.title}
                >
                    {this.renderCta(item, 'carousel')}
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
