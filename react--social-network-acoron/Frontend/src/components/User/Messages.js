import React, { useEffect, useState, useContext } from 'react'
import ReadMsg from '../elements/ReadMsg';
import Modal from '../elements/Modal';
import UserContext from '../../context/user/userContext';
import MessagesContext from '../../context/messages/messagesContext';
import { Spinner } from '../elements';

const Messages = (props) => {
    const { authenticated } = useContext(UserContext);

    const { messages, getMessages, deleteSingleMessage, sendMessage } = useContext(MessagesContext)

    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (authenticated) {
            const getMsg = async () => {
                setLoading(true);
                await getMessages();
                setLoading(false);
            }
            getMsg();
        }
        //eslint-disable-next-line
    }, [authenticated])


    const onOpenModalHandler = (fn, id, type) => {
        setShowModal(!showModal)
        setModalAction({ fn: fn.bind(null, id), type });
    }
    
    const onDeleteHandler = async (messageId) => {
        setLoading(true);
        await deleteSingleMessage(messageId);
        setLoading(false);
    }

    const onSendMessageHandler = async (e, message )=> {
        e.preventDefault();
        const sentStatus = await sendMessage(message);
        setModalAction({ fn: () => props.history.push('/'), type: sentStatus });
        setShowModal(true);         
    }

    return (
        <>
            {showModal ? <Modal
                showModal={showModal}
                setShowModal={setShowModal}
                modalAction={modalAction}
            /> : null}
            {loading ? <Spinner /> : (
                <div>
                    {messages.map(msg =>
                        <ReadMsg
                            key={msg._id}
                            msg={msg}
                            onSendMessageHandler={onSendMessageHandler}
                            onDeleteHandler={(id) => onOpenModalHandler(onDeleteHandler, id, 'delete')}
                        />
                    )}
                </div>
            )}
        </>
    );
}

export default Messages;