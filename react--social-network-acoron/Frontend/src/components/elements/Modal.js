import React, { useState } from 'react';
import ReactDOM from 'react-dom';


export default ({ showModal, setShowModal, modalAction }) => {
    const [showClass, setShowClass] = useState('modal fade');
    const acceptedActionHandler = action => {
        setShowModal(!showModal);
        action();
    }

    setTimeout(() => { setShowClass('modal fade show') }, 100);

    const modalContent = { title: '', content: '', cancel: '', action: '' };
    let { title, content, cancel, action } = modalContent;
    switch (modalAction.type) {
        case 'delete':
            title = 'Warning!';
            content = 'Are you sure you want to delete this?';
            cancel = 'Cancel';
            action = 'Delete';
            break;
        case 'deleteError':
            title = 'Problem!';
            content = 'Could not delete this!';
            action = 'Accept';
            break;
        case 'createThoughtError':
            title = 'Problem!';
            content = 'Your thought could not be published';
            action = 'Accept';
            break;
        case 'createCommentError':
            title = 'Problem!';
            content = 'Your comment could not be published';
            action = 'Accept';
            break;
        case 'updateSettings':
            title = 'Settings updated correctly!'
            content = 'Your settings has been updated correctly'
            action = 'Accept'
            break;
        case 'messageSucceed':
            title = 'Message Sent Correctly!'
            content = 'Your message has been delivered correctly'
            action = 'Accept'
            break;
        case 'messageFailed':
            title = 'Message Could not be send!'
            content = 'There was a problem and your message could not be send'
            action = 'Accept'
            break;
        case 'logout':
            title = 'Logging out!'
            content = 'You did log out sucessfully'
            action = 'Accept'
            break;
        case 'likeError':
            title = 'Cannot submit like!'
            content = 'You are not logged in or you have liked this before'
            action = 'Accept'
            break;
        default:
            title = 'Something went wrong!'
            content = 'Please try again later'
            action = 'Accept'
    }

    return ReactDOM.createPortal(
        <div
            className={showClass}
            style={{
                background: 'var(--secondary-muted)',
                display: `${showModal ? 'block' : 'none'}`
            }}
            aria-labelledby="simpleModal"
            aria-hidden="true"
            id="simpleModal"
            onClick={() => setShowModal(false)}
        >
            <div
                className="modal-dialog"
                role="document"
            >
                <div
                    className="modal-content"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                            onClick={() => setShowModal(!showModal)}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>{content}</p>
                    </div>
                    <div className="modal-footer">
                        {cancel ? (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-dismiss="modal"
                                onClick={() => setShowModal(!showModal)}
                            >{cancel}</button>
                        ) : null}
                        <button
                            type="button"
                            className="btn btn-primary border-none"
                            onClick={() => acceptedActionHandler(modalAction.fn)}
                        >{action}</button>

                    </div>
                </div>
            </div>
        </div>,
        document.getElementById('modal')
    )
};

// export const Backdrop = props => {
//     return ReactDOM.createPortal(
//         <div>
//             BACKDROP
//         </div>,

//     )
// }