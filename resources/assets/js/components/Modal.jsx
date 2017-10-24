import React from 'react';
import R from 'ramda';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import { connect } from 'react-redux';
import * as Actions from 'actions';

class Modal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            animating: false,
        };
    }

    animate() {
        this.setState(
            {
                animating: true,
            },
            () => {
                setTimeout(() => this.setState({ animating: false }), 800);
            }
        );
    }

    buttonClass() {
        return `modal__close-button modal__close-button--blue modal__close-button--small ${this
            .state.animating
            ? 'animated rubberBand'
            : ''} ${this.props.buttonCloseDisabled ? 'disabled' : ''}`;
    }

    closeIfOverlayClick(e, close) {
        const targetClass = e.target.getAttribute('class');

        if (R.contains(targetClass, 'modal__wrapper') || R.contains(targetClass, 'modal__overlay')) {
            close();
        }
    }

    render() {
        const childrenWithProps = React.Children.map(
            this.props.children,
            child =>
                React.cloneElement(child, {
                    animate: () => this.animate(),
                })
        );

        return (
            <div className="modal"
                onClick={
                    (e) => this.closeIfOverlayClick(e, this.props.onClose)
                }
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
                                    <div className="modal__subtitle">
                                        {this.props.subtitle}
                                    </div>
                                </div>
                                <div className="modal__close">
                                    <SVGInline
                                        onClick={this.props.onClose}
                                        height="20px"
                                        width="20px"
                                        className="modal__close-x"
                                        svg={zondicons['close']}
                                    />
                                </div>
                            </div>
                        ) : (
                            ''
                        )}
                        {this.props.nowrapper ? (
                            <div>{childrenWithProps}</div>
                        ) : (
                            <div
                                className={`modal__body ${this.props.closeText
                                    ? this.props.title
                                      ? ''
                                      : 'modal__body--no-header'
                                    : 'modal__body--no-footer'}`}
                            >
                                {childrenWithProps}
                            </div>
                        )}
                        {this.props.closeText ? (
                            <div className="modal__footer">
                                <button
                                    onClick={this.props.onClose}
                                    className={this.buttonClass()}
                                >
                                    {this.props.closeText}
                                </button>
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
        selectedMakes: state.selectedMakes,
    };
};

export default connect(mapStateToProps, Actions)(Modal);
