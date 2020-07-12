import React from 'react';

const RightPanel = ({boostrapStyles}) => {
    return (
        <div className={boostrapStyles}>
            <h2 className="text-center right-panel__title mt-4">#HotTopics</h2>
            <ul className="right-panel__menu mt-4 p-0">
                <li className="my-2">#LoremIpsum</li>
                <li className="my-2">#MetusCursusEu</li>
                <li className="my-2">#sitAmet</li>
                <li className="my-2">#Pellentesque</li>
                <li className="my-2">#posuere</li>
                <li className="my-2">#NibhNon</li>
            </ul>
        </div>
    )
}

export default RightPanel;