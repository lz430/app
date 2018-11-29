import { withRouter } from 'next/router';
import Link from 'next/link';
import React, { Children } from 'react';

const ActiveLink = ({ router, children, ...props }) => {
    const child = Children.only(children);

    let className = child.props.className || '';
    if (router.pathname === props.href || router.asPath === props.href) {
        className = `${className} active`.trim();
    }

    return <Link {...props}>{React.cloneElement(child, { className })}</Link>;
};

export default withRouter(ActiveLink);
