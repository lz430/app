import React from 'react';
import HomepageSearch from './HomepageSearch';
import PropTypes from 'prop-types';
import { buildURL } from 'react-imgix';
import { buildStaticImageUrl } from '../../../util/util';

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
            buildStaticImageUrl('/static/brochure/Home_Bg.jpg'),
            { auto: ['format', 'compress'], sizes: '100vw' }
        );

        return (
            <div className="home__hero">
                <div
                    className="home__hero__banner"
                    style={{ backgroundImage: 'url(' + backgroundUrl + ')' }}
                >
                    <h1>Buy or Lease a New Car, Your Way</h1>
                    <HomepageSearch
                        purchaseStrategy={this.props.purchaseStrategy}
                        push={this.props.push}
                        onRequestSearch={this.props.onRequestSearch}
                        onClearSearchResults={this.props.onClearSearchResults}
                        onSetSelectedMake={this.props.onSetSelectedMake}
                        autocompleteResults={this.props.autocompleteResults}
                    />
                </div>
            </div>
        );
    }
}
