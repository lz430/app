import React from 'react';
import PropTypes from 'prop-types';

import { faChevronUp, faChevronDown } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class AccordionTable extends React.PureComponent {
    static propTypes = {
        children: PropTypes.node.isRequired,
        header: PropTypes.string.isRequired,
    };

    state = {
        isOpen: false,
    };

    toggleOpen() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    classNames() {
        let classes = ['compare-page-table'];

        if (this.state.isOpen) {
            classes.push('compare-page-table--open');
        } else {
            classes.push('compare-page-table--closed');
        }

        return classes.join(' ');
    }

    renderHeader() {
        return (
            <div
                onClick={() => this.toggleOpen()}
                className="compare-page-table__header"
            >
                {this.state.isOpen ? (
                    <FontAwesomeIcon
                        icon={faChevronDown}
                        className="compare-page-table__header-cheveron"
                    />
                ) : (
                    <FontAwesomeIcon
                        icon={faChevronUp}
                        className="compare-page-table__header-cheveron"
                    />
                )}
                {this.props.header}
            </div>
        );
    }

    render() {
        return (
            <div className={this.classNames()}>
                {this.renderHeader()}
                <div className="compare-page-table__content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default AccordionTable;
