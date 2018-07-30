import React from 'react';

const Loading = props => (
    <div className="loading" title={5}>
        <svg
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width={24}
            height={30}
            {...props}
        >
            <path fill="#333" d="M0 13h4v5H0z">
                <animate
                    attributeName="height"
                    attributeType="XML"
                    values="5;21;5"
                    begin="0s"
                    dur="0.6s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="y"
                    attributeType="XML"
                    values="13; 5; 13"
                    begin="0s"
                    dur="0.6s"
                    repeatCount="indefinite"
                />
            </path>
            <path fill="#333" d="M10 13h4v5h-4z">
                <animate
                    attributeName="height"
                    attributeType="XML"
                    values="5;21;5"
                    begin="0.15s"
                    dur="0.6s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="y"
                    attributeType="XML"
                    values="13; 5; 13"
                    begin="0.15s"
                    dur="0.6s"
                    repeatCount="indefinite"
                />
            </path>
            <path fill="#333" d="M20 13h4v5h-4z">
                <animate
                    attributeName="height"
                    attributeType="XML"
                    values="5;21;5"
                    begin="0.3s"
                    dur="0.6s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="y"
                    attributeType="XML"
                    values="13; 5; 13"
                    begin="0.3s"
                    dur="0.6s"
                    repeatCount="indefinite"
                />
            </path>
        </svg>
    </div>
);

export default Loading;