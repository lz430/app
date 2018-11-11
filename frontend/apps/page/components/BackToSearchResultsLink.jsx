import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { buildSearchQueryUrl } from '../../../modules/deal-list/helpers';

class BackToSearchResultsLink extends React.PureComponent {
    static propTypes = {
        searchQuery: PropTypes.object.isRequired,
    };

    render() {
        const query = buildSearchQueryUrl(this.props.searchQuery, 'object');
        return (
            <Link
                href={{ pathname: '/deal-list', query: query }}
                as={{ pathname: '/filter', query: query }}
                passHref
            >
                <a>Search Results</a>
            </Link>
        );
    }
}

export default BackToSearchResultsLink;
