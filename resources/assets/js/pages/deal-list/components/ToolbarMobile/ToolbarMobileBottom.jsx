import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Tuning from 'icons/zondicons/Tuning';
import CheveronLeft from 'icons/zondicons/CheveronLeft';

import {
    clearModelYear,
    toggleSearchSort,
    toggleSmallFiltersShown,
} from '../../actions';
import { getSearchQuery } from '../../selectors';

import SortWidget from './SortWidget';

/**
 *
 */
class ToolbarMobileBottom extends React.Component {
    static propTypes = {
        searchQuery: PropTypes.object.isRequired,
        onToggleSmallFiltersShown: PropTypes.func.isRequired,
        onClearModelYear: PropTypes.func.isRequired,
        onToggleSearchSort: PropTypes.func.isRequired,
    };

    state = {
        activeTab: null,
    };

    setSort(sort) {
        this.props.onToggleSearchSort(sort);
    }

    setActiveTab(tab) {
        if (this.state.activeTab === tab) {
            this.setState({ activeTab: null });
        } else {
            this.setState({ activeTab: tab });
        }
    }

    renderBackButton() {
        return (
            <div
                className={classNames('toolbar-item', {
                    active: this.state.activeTab === 'model',
                })}
                onClick={() => this.setActiveTab('model')}
            >
                <CheveronLeft
                    height="16px"
                    className="sortbar__filter-toggle-icon"
                />{' '}
                Model
            </div>
        );
    }

    renderTrayContent() {
        if (this.state.activeTab === 'sort') {
            return (
                <SortWidget
                    searchQuery={this.props.searchQuery}
                    onToggleSearchSort={this.props.onToggleSearchSort}
                />
            );
        }

        return false;
    }

    render() {
        return (
            <div className="toolbar-mobile-bottom">
                <div
                    className={classNames('tray', {
                        show: this.state.activeTab !== null,
                    })}
                >
                    {this.renderTrayContent()}
                </div>
                <div className="menu">
                    <div
                        className={classNames('toolbar-item', {
                            active: this.state.activeTab === 'filter',
                        })}
                        onClick={this.props.onToggleSmallFiltersShown}
                    >
                        <Tuning
                            height="16px"
                            className="sortbar__filter-toggle-icon"
                        />
                        Filter
                    </div>
                    <div
                        className={classNames('toolbar-item', {
                            active: this.state.activeTab === 'sort',
                        })}
                        onClick={() => this.setActiveTab('sort')}
                    >
                        <Tuning
                            height="16px"
                            className="sortbar__filter-toggle-icon"
                        />
                        Sort
                    </div>
                    <div
                        className={classNames('toolbar-item', {
                            active: this.state.activeTab === 'payment',
                        })}
                        onClick={() => this.setActiveTab('payment')}
                    >
                        <Tuning
                            height="16px"
                            className="sortbar__filter-toggle-icon"
                        />
                        Payment
                    </div>
                    {this.props.searchQuery.entity === 'deal' &&
                        this.renderBackButton()}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        searchQuery: getSearchQuery(state),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onToggleSmallFiltersShown: () => {
            return dispatch(toggleSmallFiltersShown());
        },
        onClearModelYear: () => {
            return dispatch(clearModelYear());
        },
        onToggleSearchSort: sort => {
            return dispatch(toggleSearchSort(sort));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolbarMobileBottom);
