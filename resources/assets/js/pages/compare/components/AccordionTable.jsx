import React from 'react';
import PropTypes from 'prop-types';

import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';

class AccordionTable extends React.PureComponent {
    static propTypes = {
        children: PropTypes.node.isRequired,
        header: PropTypes.string.isRequired,
    };

    state = {
        isOpen: false,
    };

    toggleOpen() {
        console.log('TOGGLE OPEN');
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
                <SVGInline
                    className="compare-page-table__header-cheveron"
                    svg={
                        this.state.isOpen
                            ? zondicons['cheveron-down']
                            : zondicons['cheveron-up']
                    }
                />
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
