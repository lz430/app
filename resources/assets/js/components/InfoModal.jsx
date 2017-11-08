import React from 'react';
import zondicons from "../zondicons";
import * as Actions from 'actions/index';
import { connect } from 'react-redux';
import SVGInline from 'react-svg-inline';

class InfoModal extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            body: null,
            toggled: false,
        };
    }

    renderModal() {
        return (
            <div className="modal">
                <div className="modal__overlay" />
                <div className="modal__wrapper">
                    <div className="modal__content">
                        <div className="modal__header">
                            <div className="modal__titles">
                                abc
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    toggleModal() {
        this.setState({ toggled: !this.state.toggled});
        console.log(this.state)
    }

    render() {
        return <div>
            <a
                    onClick={() => {this.toggleModal()}}
                    href="#"
                >
                    <SVGInline width="15px" fill="grey" svg={zondicons['information-outline']} />
                </a>
                {this.state.toggled ? this.renderModal() : ''}
            </div>
    }
}

const mapStateToProps = state => {
    return {
    };
};

export default connect(mapStateToProps, Actions)(InfoModal);
