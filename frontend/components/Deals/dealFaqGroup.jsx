import React from 'react';
import PropTypes from 'prop-types';
import { Col, Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

class ListGroupCollapse extends React.Component {
    static propTypes = {
        item: PropTypes.object,
        isOpen: PropTypes.bool.isRequired,
        onToggle: PropTypes.func.isRequired,
    };

    render() {
        const { item, isOpen, onToggle } = this.props;
        return (
            <Col key={item.title}>
                <div
                    className={isOpen ? 'title active' : 'title'}
                    onClick={() => onToggle(item.title)}
                    id={item.key}
                >
                    {item.title}
                    <FontAwesomeIcon
                        icon={isOpen ? faChevronUp : faChevronDown}
                    />
                </div>
                <Collapse isOpen={isOpen}>
                    <div className="content">
                        <span
                            dangerouslySetInnerHTML={{
                                __html: this.props.item.content,
                            }}
                        />
                    </div>
                </Collapse>
            </Col>
        );
    }
}

export default ListGroupCollapse;
