import React from 'react';
import HomepageSearch from './HomepageSearch';
import PropTypes from 'prop-types';
import { buildURL } from 'react-imgix';
import { buildStaticImageUrl } from '../../../util/util';
import Link from 'next/link';

export default class extends React.Component {
    static propTypes = {
        purchaseStrategy: PropTypes.string,
        autocompleteResults: PropTypes.object,
        onRequestSearch: PropTypes.func.isRequired,
        onClearSearchResults: PropTypes.func.isRequired,
        onSetSelectedMake: PropTypes.func.isRequired,
        push: PropTypes.func.isRequired,
    };

    render() {
        const backgroundUrl = buildURL(
            buildStaticImageUrl('/static/brochure/home/DMR-Desktop-Banner.jpg'),
            { auto: ['format', 'compress'], sizes: '100vw' }
        );

        return (
            <div className="home__hero">
                <div
                    className="home__hero__banner"
                    style={{ backgroundImage: 'url(' + backgroundUrl + ')' }}
                >
                    <div className="home__hero__banner-story">
                        <div>
                            <div className="home__hero__banner-story-quote-wrapper">
                                <div className="home__hero__banner-story-quote">
                                    &quot;I Just bought a car in 20
                                    minutes!&quot;
                                </div>
                                <div className="home__hero__banner-story-from">
                                    Happy Customer - <strong>BOB WAUN</strong>
                                </div>
                            </div>
                            <Link
                                href="/brochure/story/bob2019chevroletequinox"
                                as="/story/bob2019chevroletequinox"
                            >
                                <a className="btn btn-outline-white">
                                    Bob&apos;s Story
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div className="home__hero__banner-motto">
                        <ul>
                            <li>Love your car.</li>
                            <li>Love your price.</li>
                            <li>Love your experience.</li>
                        </ul>
                        <span>Why buy a car any other way?</span>
                    </div>
                </div>
                <HomepageSearch
                    purchaseStrategy={this.props.purchaseStrategy}
                    push={this.props.push}
                    onRequestSearch={this.props.onRequestSearch}
                    onClearSearchResults={this.props.onClearSearchResults}
                    onSetSelectedMake={this.props.onSetSelectedMake}
                    autocompleteResults={this.props.autocompleteResults}
                />
            </div>
        );
    }
}
