import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { buildSearchQueryUrl } from '../../../modules/deal-list/helpers';
import StyleIcon from '../../../components/Deals/StyleIcon';

import { faSearch, faSpinner } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SearchWidget extends React.PureComponent {
    static propTypes = {
        purchaseStrategy: PropTypes.string,
        autocompleteResults: PropTypes.object,
        onRequestSearch: PropTypes.func.isRequired,
        onClearSearchResults: PropTypes.func.isRequired,
        onSetSelectedMake: PropTypes.func.isRequired,
        push: PropTypes.func.isRequired,
    };

    state = {
        query: '',
        resultsAreLoading: false,
        selectedItem: null,
        SearchMobile: false,
        SearchMessage: true,
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }

    /**
     * @param prevProps
     */
    componentDidUpdate(prevProps) {
        if (
            this.state.resultsAreLoading &&
            this.props.autocompleteResults !== prevProps.autocompleteResults
        ) {
            this.setState({ resultsAreLoading: false });
        }
    }

    toggleSearchMobile() {
        this.setState({
            SearchMobile: !this.state.SearchMobile,
        });
    }

    renderSearchMessage() {
        if (this.state.SearchMessage !== true) {
            return false;
        }

        return (
            <div className="ghost h-100">
                <h3>Start typing to see results </h3>
            </div>
        );
    }

    handleClick = e => {
        if (this.node.contains(e.target)) {
            return;
        }

        this.setState({ query: '' });
        this.props.onClearSearchResults();
    };

    onSelectItem(category, item) {
        let newSearchQuery = { ...item.query };
        newSearchQuery.purchaseStrategy = this.props.purchaseStrategy;

        if (item.query.make) {
            this.props.onSetSelectedMake(item.query.make);
        }

        const urlQuery = buildSearchQueryUrl(newSearchQuery);
        this.setState({
            query: '',
            SearchMessage: false,
        });
        this.props.onClearSearchResults();
        this.props.push(`/deal-list?${urlQuery}`, `/filter?${urlQuery}`);
        this.toggleSearchMobile();
    }

    handleSearchRequest(query) {
        this.setState({ query: query });

        if (query && query.length > 2) {
            this.setState({ resultsAreLoading: true });
            this.props.onRequestSearch(query);
        }
    }

    renderResultItemIcon(category, item) {
        if (category === 'style') {
            return <StyleIcon style={item.icon} />;
        }

        if (item.icon) {
            return <img alt={item.label} src={item.icon} />;
        }

        return false;
    }

    renderResultItem(category, item) {
        return (
            <li
                className="search__results__item"
                key={item.label}
                onClick={() => this.onSelectItem(category, item)}
            >
                <div className="search__results__item__icon">
                    {this.renderResultItemIcon(category, item)}
                </div>

                <div className="search__results__item__title">
                    <div className="search__results__item__title__label">
                        {item.label}
                    </div>
                    <div className="search__results__item__title__count">
                        ({item.count})
                    </div>
                </div>

                <div className="search__results__item__cta">
                    <span className="btn btn-sm btn-outline-primary">
                        Select
                    </span>
                </div>
            </li>
        );
    }

    renderSearchResultCategory(category, items) {
        if (!items.length) {
            return false;
        }
        const headers = {
            model: 'Model',
            make: 'Brand',
            style: 'Style',
        };

        return (
            <div className="search__results__category" key={category}>
                <div className="search__results__category__header">
                    {headers[category]}
                </div>
                <ul className="search__results__category__list">
                    {items.map(item => this.renderResultItem(category, item))}
                </ul>
            </div>
        );
    }

    renderSearchResults(mobile = false) {
        const results = this.props.autocompleteResults;
        if (results && !Object.keys(results).length) {
            return false;
        }

        if (!results) {
            return false;
        }

        const showResults = !!(
            results.model.length ||
            results.make.length ||
            results.style.length
        );
        const showNoResults = !!(
            !results.model.length &&
            !results.make.length &&
            !results.style.length
        );

        return (
            <div
                className={classNames('search__results', {
                    search_results_mobile: mobile,
                })}
            >
                {showNoResults && (
                    <div className="ghost h-100 p-1">
                        <h3>No results found, please try different keywords</h3>
                    </div>
                )}
                {showResults &&
                    Object.keys(results).map(key =>
                        this.renderSearchResultCategory(key, results[key])
                    )}
            </div>
        );
    }

    /**
     *
     * @returns {*}
     */
    renderSearchIcon() {
        if (this.state.resultsAreLoading) {
            return (
                <FontAwesomeIcon
                    className="loading-icon"
                    icon={faSpinner}
                    spin={true}
                />
            );
        }

        return <FontAwesomeIcon icon={faSearch} className="search-icon" />;
    }

    /**
     *
     * @returns {*}
     */
    render() {
        return (
            <div className="home__search" ref={node => (this.node = node)}>
                <h2>Search new cars from local dealers</h2>
                <div className="search__input">
                    {this.renderSearchIcon()}
                    <input
                        type="text"
                        onChange={e => {
                            this.handleSearchRequest(e.target.value);
                        }}
                        value={this.state.query}
                        placeholder="Search by Brand or Model"
                        required
                    />
                </div>
                {this.state.query && this.renderSearchResults()}
            </div>
        );
    }
}

export default SearchWidget;
