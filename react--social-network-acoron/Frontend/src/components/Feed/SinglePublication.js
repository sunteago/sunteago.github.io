import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom';
import { Spinner, NotFoundBox } from '../elements';
import ReadBox from '../elements/ReadBox';
import { driveHome } from '../helpers';
import WritingBox from '../elements/WritingBox';
import UserContext from '../../context/user/userContext';
import ThoughtsContext from '../../context/thoughts/thoughtsContext';
import openSocket from 'socket.io-client';
import Modal from '../elements/Modal';



const SinglePublication = (props) => {
    const [loading, setLoading] = useState(true);

    const userContext = useContext(UserContext);
    const { authenticated, user, user: { avatar } } = userContext;

    const { currentThought, getThought, likeThought,
        likeComment, deleteThought, deleteComment,
        createComment } = useContext(ThoughtsContext);
    const { slug } = useParams();

    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState({});

    useEffect(() => {
        let mounted = true;
        getThoughtAndComments();

        const socket = openSocket(process.env.REACT_APP_BACKEND_URL);
        socket.on('thoughts', data => {
            if (data.action === 'createComment' && mounted) {
                getThoughtAndComments();
            }
        });
        return () => {
            socket.off('thoughts');
            mounted = false;
        }
        //eslint-disable-next-line
    }, []);

    const onOpenModalHandler = (fn, id, type) => {
        setShowModal(!showModal)
        setModalAction({ fn: fn.bind(null, id), type });
    }


    const onCreateCommentHandler = async (content, thoughtId) => {
        const failed = await createComment(content, thoughtId);
        if (failed) onOpenModalHandler(() => { }, null, 'createCommentError');
        return failed;
    }

    const getThoughtAndComments = async () => {
        setLoading(true);
        await getThought(slug);
        setTimeout(() => setLoading(false), 200);
    }

    const onDeleteThoughtHandler = async ({ thoughtId }) => {
        setLoading(true);
        const succeed = await deleteThought({ thoughtId }, props.history);
        if (!succeed) onOpenModalHandler(()=> {}, null, 'deleteError');
        setTimeout(() => setLoading(false), 200);
    }

    const onDeleteCommentHandler = async ({ thoughtId, commentId }) => {
        setLoading(true);
        const succeed = await deleteComment({ thoughtId, commentId });
        if (!succeed) onOpenModalHandler(()=> {}, null, 'deleteError');
        setTimeout(() => setLoading(false), 200);

    }
    const onLikeThoughtHandler = async (id) => {
        const succeed = await likeThought(id, user._id);
        if (succeed === false) {
            setModalAction({ fn: () => { }, type: 'likeError' });
            setShowModal(true);
        }
    }
    const onLikeCommentHandler = async (id) => {
        const succeed = await likeComment(id, user._id);
        if (succeed === false) {
            setModalAction({ fn: () => { }, type: 'likeError' });
            setShowModal(true);
        }
    }

    if (Object.keys(currentThought).length === 0) return (
        <>
            {loading ? <Spinner /> : (
                <NotFoundBox>
                    <h1>Thought could not found</h1>
                    <p>You're going to be redirected to home, if you are not redirected,
                    click <Link
                            to="/"
                            style={{ textDecoration: 'none', fontWeight: 'bold', color: 'var(--secondary)' }}
                        >here</Link></p>
                    {driveHome(props.history)}
                </NotFoundBox>
            )}
        </>
    )

    return (
        <>
            {showModal ? <Modal
                showModal={showModal}
                setShowModal={setShowModal}
                modalAction={modalAction}
            /> : null}
            <ReadBox
                viewerId={user._id}
                type="thought"
                data={currentThought}
                onLikeHandler={onLikeThoughtHandler}
                authenticated={authenticated}
                onDeleteHandler={(id) => onOpenModalHandler(onDeleteThoughtHandler, id, 'delete', props.history)}
            />
            <br />
            {currentThought.comments.map(comment =>
                <ReadBox
                    type="comment"
                    data={comment}
                    thoughtId={currentThought._id}
                    viewerId={user._id}
                    authenticated={authenticated}
                    key={comment._id}
                    onLikeHandler={onLikeCommentHandler}
                    onDeleteHandler={(id) => onOpenModalHandler(onDeleteCommentHandler, id, 'delete')}
                />
            )}
            {loading ? <Spinner /> : null}
            {authenticated ? (
                <WritingBox
                    avatar={avatar}
                    thoughtId={currentThought._id}
                    name={user.name}
                    username={user.username}
                    onCreateHandler={onCreateCommentHandler}
                    mode="comment"
                />
            ) : null}
        </>
    );
}

export default SinglePublication;