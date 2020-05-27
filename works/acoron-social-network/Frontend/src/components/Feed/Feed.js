import React, { useState, useEffect, useContext } from 'react'
import WritingBox from '../elements/WritingBox'
import ReadBox from '../elements/ReadBox';
import openSocket from 'socket.io-client';
import UserContext from '../../context/user/userContext';
import ThoughtsContext from '../../context/thoughts/thoughtsContext';
import { Spinner, NotFoundBox } from '../elements';
import Modal from '../elements/Modal';

const Feed = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState({});

    const userContext = useContext(UserContext);
    const { authenticated, user, user: { avatar } } = userContext;


    const { thoughts, getThoughts, deleteThought, likeThought, createThought } = useContext(ThoughtsContext);

    useEffect(() => {
        loadThoughts();
        const socket = openSocket(process.env.REACT_APP_BACKEND_URL);
        socket.on('thoughts', data => {
            if (data.action === 'createThought') {
                setLoading(true);
                loadThoughts();
            }
        })
    }, []);


    const onOpenModalHandler = (fn, id, type) => {
        setShowModal(!showModal)
        setModalAction({ fn: fn.bind(null, id), type });
    }

    const onCreateThoughtHandler = async (content) => {
        const failed = await createThought(content);
        if (failed) onOpenModalHandler(() => {}, null, 'createThoughtError');
        return failed;
    }

    const loadThoughts = async () => {
        const thoughts = await getThoughts();
        if (thoughts === false) setError(true);
        setLoading(false);
    }

    const onDeleteHandler = async (id) => {
        setLoading(true);
        const succeed = await deleteThought(id);
        if (!succeed) onOpenModalHandler(()=> {}, null, 'deleteError');
        setTimeout(() => setLoading(false), 200);
    }

    const onLikeHandler = async (id) => {
        const succeed = await likeThought(id, user._id );
        if (succeed === false) {
            setModalAction({ fn: () => {}, type: 'likeError' });
            setShowModal(true);
        }
    }


    return (
        <>
            {showModal ? <Modal
                showModal={showModal}
                setShowModal={setShowModal}
                modalAction={modalAction}
            /> : null}
            {authenticated ? (
                <WritingBox
                    avatar={avatar}
                    username={user.username}
                    name={user.name}
                    mode="thought"
                    onCreateHandler={onCreateThoughtHandler}
                />
            ) : null}
            {loading ? <Spinner /> : null}
            {error ? (
                <NotFoundBox>
                    <h2>We are experiencing some problems</h2>
                    <p>Please, refresh the page or try again later</p>
                </NotFoundBox>
            ) : null}
            {thoughts.length > 0 ? (
                thoughts.map(thought => (
                    <ReadBox
                        key={thought._id}
                        data={thought}
                        type="thought"
                        viewerId={user._id}
                        onDeleteHandler={(id) => onOpenModalHandler(onDeleteHandler, id, 'delete')}
                        onLikeHandler={onLikeHandler}
                        authenticated={authenticated}
                    />
                ))
            ) : null}
        </>
    );
}

export default Feed;