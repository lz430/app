import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { connect } from 'react-redux';
import classNames from 'classnames';

import * as Actions from 'apps/common/actions';
import util from 'src/util';
import Close from 'icons/zondicons/Close';

class Modal extends React.Component {
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        className: PropTypes.string,
    };

    state = {
        animating: false,
    };

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    animate() {
        this.setState(
            {
                animating: true,
            },
            () => {
                setTimeout(() => {
                    if (this._isMounted) {
                        this.setState({
                            animating: false,
                        });
                    }
                }, 800);
            }
        );
    }

    buttonClass() {
        if (this.props.deal) {
            return 'deal__button deal__button--small deal__button--blue';
        }

        return `modal__close-button modal__close-button--blue modal__close-button--small ${
            this.state.animating ? 'animated rubberBand' : ''
        } ${this.props.buttonCloseDisabled ? 'disabled' : ''}`;
    }

    closeIfOverlayClick(e, close) {
        const targetClass = e.target.getAttribute('class');

        if (
            R.contains(targetClass, 'modal__wrapper') ||
            R.contains(targetClass, 'modal__overlay')
        ) {
            // make sure we only close the outermost overlay
            e.stopPropagation();
            close();
        }
    }

    render() {
        const childrenWithProps = React.Children.map(
            this.props.children,
            child => {
                if (typeof this.animate == 'function') {
                    React.cloneElement(child, {
                        animate: () => this.animate(),
                    });
                }
                return child;
            }
        );

        return (
            <div
                className={classNames('modal', this.props.className)}
                onClick={e => this.closeIfOverlayClick(e, this.props.onClose)}
            >
                <div className="modal__overlay" />
                <div className="modal__wrapper">
                    <div className="modal__content">
                        {this.props.title ? (
                            <div className="modal__header">
                                <div className="modal__titles">
                                    <div className="modal__title">
                                        {this.props.title}
                                    </div>
                                    {this.props.subtitle && (
                                        <div className="modal__subtitle">
                                            {this.props.subtitle}
                                        </div>
                                    )}
                                </div>
                                <div className="modal__close">
                                    <Close
                                        onClick={this.props.onClose}
                                        height="20px"
                                        width="20px"
                                        className="modal__close-x"
                                    />
                                </div>
                            </div>
                        ) : (
                            ''
                        )}
                        <div
                            className={`${
                                this.props.nowrapper ? '' : 'modal__body'
                            } ${
                                this.props.closeText
                                    ? this.props.title
                                        ? ''
                                        : 'modal__body--no-header'
                                    : 'modal__body--no-footer'
                            }`}
                        >
                            {!this.props.title &&
                            !util.windowIsLargerThanSmall(
                                this.props.window.width
                            ) ? (
                                <div className="modal__close--info modal__close--info--color-secondary">
                                    <Close
                                        onClick={this.props.onClose}
                                        height="20px"
                                        width="20px"
                                        className="modal__close-x--info"
                                    />
                                </div>
                            ) : (
                                ''
                            )}
                            {childrenWithProps}
                        </div>
                        {this.props.closeText || this.props.deal ? (
                            <div className="modal__footer">
                                {this.props.closeText ? (
                                    <button
                                        onClick={this.props.onClose}
                                        className={this.buttonClass()}
                                    >
                                        {this.props.closeText}
                                    </button>
                                ) : (
                                    ''
                                )}
                                {this.props.deal ? (
                                    <button
                                        onClick={() => {
                                            this.props.onClose();

                                            window.location = `/confirm/${
                                                this.props.deal.id
                                            }`;
                                        }}
                                        className="deal__button deal__button--small deal__button--pink deal__button"
                                    >
                                        Buy Now
                                    </button>
                                ) : (
                                    ''
                                )}
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        window: state.common.window,
    };
};

export default connect(
    mapStateToProps,
    Actions
)(Modal);
