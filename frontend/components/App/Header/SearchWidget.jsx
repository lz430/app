import React from 'react';
import PropTypes from 'prop-types';
import { MediumAndUp, SmallAndDown } from '../../Responsive';
import classNames from 'classnames';

import { buildSearchQueryUrl } from '../../../modules/deal-list/helpers';
import StyleIcon from '../../Deals/StyleIcon';
import Search from '../../../icons/zondicons/search.svg';
import Close from '../../../icons/zondicons/close.svg';
import { nextRouterType } from '../../../core/types';

class SearchWidget extends React.PureComponent {
    static propTypes = {
        currentPageIsInCheckout: PropTypes.bool,
        onRequestSearch: PropTypes.func.isRequired,
        autocompleteResults: PropTypes.object,
        router: nextRouterType,
        searchQuery: PropTypes.object,
    };

    state = {
        query: '',
        selectedItem: null,
        SearchMobile: false,
        SearchMessage: true,
    };

    toggleSearchMobile() {
        this.setState({
            SearchMobile: !this.state.SearchMobile,
        });
    }
    toggleClass() {
        const currentState = this.state.active;
        this.setState({ active: !currentState });
    }
    renderSearchMessage() {
        if (this.state.SearchMessage === true) {
            return (
                <div className="ghost h-100">
                    <h3>Start typing to see results </h3>
                </div>
            );
        }
    }
    componentDidMount() {
        document.addEventListener('mousedown', this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }

    handleClick = e => {
        if (this.node.contains(e.target)) {
            return;
        }

        this.setState({ query: '' });
    };

    onSelectItem(item) {
        let newSearchQuery = { ...this.props.searchQuery };
        if (item.query.entity) {
            newSearchQuery.entity = item.query.entity;
        }

        if (item.query.filters) {
            newSearchQuery.filters = item.query.filters;
        }

        const urlQuery = buildSearchQueryUrl(newSearchQuery);
        this.props.router.push('/filter?' + urlQuery);
        this.setState({ query: '' });
        this.setState({ SearchMessage: false });
        this.toggleSearchMobile();
    }

    handleSearchRequest(query) {
        this.setState({ query: query });

        if (query) {
            this.props.onRequestSearch(query);
        }
    }

    renderResultItemIcon(category, item) {
        if (category === 'style') {
            return <StyleIcon style={item.icon} />;
        }

        return <img alt={item.label} src={item.icon} />;
    }

    renderResultItem(category, item) {
        return (
            <li
                className="search__results__item"
                key={item.label}
                onClick={() => this.onSelectItem(item)}
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

    renderSearchResults() {
        const results = this.props.autocompleteResults;
        if (results && !Object.keys(results).length) {
            return false;
        }
        if (
            results &&
            (results.model.length ||
                results.make.length ||
                results.style.length)
        ) {
            return (
                <div className="search__results">
                    {Object.keys(results).map(key =>
                        this.renderSearchResultCategory(key, results[key])
                    )}
                </div>
            );
        }
        return false;
    }

    render() {
        if (this.props.currentPageIsInCheckout) {
            return false;
        }

        return (
            <div className="search " ref={node => (this.node = node)}>
                <MediumAndUp>
                    <div className="search__input">
                        <input
                            type="text"
                            onChange={e => {
                                this.handleSearchRequest(e.target.value);
                            }}
                            value={this.state.query}
                            placeholder="Search..."
                            required
                        />
                        <Search height="20px" width="20px" />
                    </div>
                    {this.state.query && this.renderSearchResults()}
                </MediumAndUp>
                <SmallAndDown>
                    <div className="search__mobile">
                        <Search
                            height="20px"
                            width="20px"
                            className={classNames({
                                active: !this.state.SearchMobile,
                                hidden: this.state.SearchMobile,
                            })}
                            onClick={() => {
                                this.toggleSearchMobile();
                                this.setState({ SearchMessage: true });
                            }}
                        />
                        <Close
                            height="20px"
                            width="20px"
                            className={classNames({
                                active: this.state.SearchMobile,
                                hidden: !this.state.SearchMobile,
                            })}
                            onClick={() => {
                                this.toggleSearchMobile();
                            }}
                        />
                    </div>
                </SmallAndDown>
                <SmallAndDown>
                    {this.state.SearchMobile && (
                        <div className="search__container-fluid">
                            <div className="row">
                                <input
                                    type="text"
                                    onChange={e => {
                                        this.handleSearchRequest(
                                            e.target.value
                                        );
                                    }}
                                    value={this.state.query}
                                    placeholder="Search..."
                                    required
                                />
                            </div>
                            {this.renderSearchMessage()}
                            {this.state.query && this.renderSearchResults()}
                        </div>
                    )}
                </SmallAndDown>
            </div>
        );
    }
}

export default SearchWidget;