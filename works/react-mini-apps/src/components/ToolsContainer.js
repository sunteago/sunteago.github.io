import React from 'react';

function ToolsContainer(props) {
    return (
        <div className="row justify-content-center">
            {props.children}
        </div>
    )
}

export default ToolsContainer;
