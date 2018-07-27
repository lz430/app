import React from 'react';

import PropTypes from 'prop-types';
import Line from 'components/pricing/Line';
import Label from 'components/pricing/Label';
import Modal from 'components/Modal';

import InformationOutline from 'icons/zondicons/InformationOutline';

class RebatesRole extends React.Component {
    static propTypes = {
        isRoleChecked: PropTypes.bool.isRequired,
        role: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    state = {
        conditionalProgramsOpened: false,
    };

    toggleProgramDescriptionModal = () => {
        this.setState({
            conditionalProgramsOpened: !this.state.conditionalProgramsOpened,
        });
    };

    roleLabels() {
        const map = {
            college: {
                title: 'College Student/Recent Grad',
                description: null,
            },
            military: {
                title: 'Active Military/Veteran',
                description: 'Thank you for your service.',
            },
            conquest: {
                title: 'Conquest',
                description: null,
            },

            loyal: {
                title: 'Loyalty',
                description: null,
            },
            responder: {
                title: 'First Responder',
                description: null,
            },
            gmcompetitive: {
                title: 'GM Competitive Lease',
                description: null,
            },
            gmlease: {
                title: 'GM Lease Loyalty',
                description: null,
            },
            cadillaclease: {
                title: 'Cadillac Lease Loyalty',
                description: null,
            },
        };

        return map[this.props.role['role']];
    }

    render() {
        const labels = this.roleLabels();
        const role = this.props.role;
        if (!labels) {
            return false;
        }
        return (
            <Line style={{ margin: '.125em 0 .125em .25em' }}>
                <Label
                    className="form-check-label"
                    key={role['role']}
                    style={{ fontSize: '.9em' }}
                >
                    <input
                        key={role['role']}
                        name="discountType"
                        value={role['role']}
                        type="checkbox"
                        className="form-check-input"
                        checked={this.props.isRoleChecked}
                        onChange={e => this.props.onChange(role)}
                    />
                    {labels.title}
                </Label>
                <a
                    onClick={() => this.toggleProgramDescriptionModal()}
                    className="link infomodal__button"
                    style={{ paddingLeft: '5px' }}
                >
                    <InformationOutline width="15px" fill="grey" />
                </a>
                {this.state.conditionalProgramsOpened && (
                    <Modal
                        className="rebate-description-modal"
                        title="Rebate Details"
                        onClose={this.toggleProgramDescriptionModal}
                    >
                        <div>
                            <h4>{labels.title}</h4>
                            <p style={{ color: 'red' }}>
                                Rebate Expires: {role.stopDate}
                            </p>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: role.description,
                                }}
                            />
                        </div>
                    </Modal>
                )}
                {this.props.isRoleChecked &&
                    labels.description && (
                        <div
                            style={{
                                fontStyle: 'italic',
                                fontSize: '.75em',
                                marginLeft: '.25em',
                            }}
                        >
                            {labels.description}
                        </div>
                    )}
            </Line>
        );
    }
}

export default RebatesRole;
