import '../styles/app.scss';
import React from 'react';
import { Jumbotron, NavLink } from 'reactstrap';
// import SearchWidget from '../components/App/Header/SearchWidget';
import Link from 'next/link';
import ShopByBrand from '../modules/home/components/ShopByBrand';
import ShopByStyle from '../modules/home/components/ShopByStyle';

export default class extends React.Component {
    state = {
        activeIndex: 0,
    };

    items = [
        {
            src: 'https://via.placeholder.com/50.png?text=Dodge',
            altText: 'Slide 1',
            caption: 'Slide 1',
        },
        {
            src: 'https://via.placeholder.com/50.png?text=Jeep',
            altText: 'Slide 2',
            caption: 'Slide 2',
        },
        {
            src: 'https://via.placeholder.com/50.png?text=Ford',
            altText: 'Slide 3',
            caption: 'Slide 3',
        },
    ];

    render() {
        return (
            <div>
                <Jumbotron>
                    <img
                        src="https://via.placeholder.com/1900x400"
                        alt="placeholder"
                    />
                    <div className="search">
                        <div className="__container">
                            <h3>Search new cars from local dealers</h3>
                        </div>
                    </div>
                </Jumbotron>

                <ShopByStyle />
                <ShopByBrand />

                <div className="container callout__info">
                    <div className="row">
                        <div className="col-6">
                            <img
                                src="https://via.placeholder.com/400x250"
                                alt="placeholder"
                            />
                            <h3>Test it out</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit. Quae corrupti facere autem ut
                                eligendi dignissimos.
                            </p>
                        </div>
                        <div className="col-6">
                            <img
                                src="https://via.placeholder.com/400x250"
                                alt="placeholder"
                            />
                            <h3>Purchase</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit. Facere eius architecto, quo
                                corporis perspiciatis error.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="container-fluid callout__testimonials">
                    <div className="container">
                        <h4>What our customers are saying</h4>
                        <div className="row">
                            <div className="col-4">
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipisicing elit. Obcaecati quas omnis,
                                    iusto vero accusamus nam veniam reiciendis
                                    quaerat quod ipsum praesentium, unde
                                    molestiae! Obcaecati, error temporibus ipsam
                                    ipsum voluptas. Est?15
                                </p>
                                <div className="author">
                                    <span>Monica P</span>
                                </div>
                            </div>
                            <div className="col-4">
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipisicing elit. Officiis ab aperiam
                                    suscipit enim, voluptatibus officia eaque
                                    iusto perspiciatis, excepturi necessitatibus
                                    aliquam quia impedit cumque quo blanditiis
                                    magni illo accusamus et!15
                                </p>
                                <div className="author">
                                    <span>Jason B, Traverse City MI</span>
                                </div>
                            </div>
                            <div className="col-4">
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipisicing elit. Quod quae soluta maiores
                                    recusandae, voluptatem ad officiis molestiae
                                    sunt cum blanditiis harum quasi laborum
                                    aliquam magnam architecto itaque ullam. Sit,
                                    distinctio!15
                                </p>
                                <div className="author">
                                    <span>Lori P, Birmingham MI</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container callout__media">
                    <div className="row">
                        <div className="col">
                            <h5>Featured In: </h5>
                        </div>
                        <div className="col">
                            <img
                                src="https://via.placeholder.com/200x50"
                                alt="placeholder"
                            />
                        </div>
                        <div className="col">
                            <img
                                src="https://via.placeholder.com/200x50"
                                alt="placeholder"
                            />
                        </div>
                        <div className="col">
                            <img
                                src="https://via.placeholder.com/200x50"
                                alt="placeholder"
                            />
                        </div>
                        <div className="col">
                            <img
                                src="https://via.placeholder.com/200x50"
                                alt="placeholder"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
