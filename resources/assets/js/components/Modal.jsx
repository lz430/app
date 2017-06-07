import React from 'react';

class Modal extends React.Component {
    render() {
        return (
            <div className="modal">
                <div className="modal__overlay" />
                <div className="modal__content">
                    <div className="modal__header">
                        <div className="modal__titles">
                            <div className="modal__title">
                                {this.props.title}
                            </div>
                            <div className="modal__subtitle">
                                {this.props.subtitle}
                            </div>
                        </div>
                        <div
                            className="modal__close"
                            onClick={this.props.onClose}
                        >
                            <button className="modal__close-button modal__close-button--blue modal__close-button--small">
                                {this.props.closeText}
                            </button>
                        </div>
                    </div>
                    <div className="modal__body">
                        {this.props.children()}
                    </div>
                </div>
            </div>
        );
    }
}

export default Modal;
