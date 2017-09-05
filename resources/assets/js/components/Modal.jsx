import React from 'react';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import { connect } from 'react-redux';
import * as Actions from 'actions';

class Modal extends React.PureComponent {
    render() {
        return (
            <div className="modal">
                <div className="modal__overlay" />
                <div className="modal__wrapper">
                    <div className="modal__content">
                        {this.props.title
                            ? <div className="modal__header">
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
                            : ''}
                        <div
                            className={`modal__body ${this.props.closeText ? (this.props.title ? '' : 'modal__body--no-header') : 'modal__body--no-footer'}`}
                        >
                            {this.props.children}
                        </div>
                        {this.props.closeText
                            ? <div className="modal__footer">
                                  <button
                                      onClick={this.props.onClose}
                                      className={`modal__close-button modal__close-button--blue modal__close-button--small` + (this.props.selectedMakes.length ? ' animated rubberBand' : '')}
                                  >
                                      {this.props.closeText}
                                  </button>
                              </div>
                            : ''}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        selectedMakes: state.selectedMakes,
    }
};

export default connect(mapStateToProps, Actions)(Modal);
