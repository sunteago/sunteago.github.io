import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GeneralPanelBox, Avatar, Spinner, NotFoundBox } from '../elements';
import MessageBox from '../elements/MessageBox'
import { showedAvatar, driveHome } from '../helpers';
import axiosConfig from '../../config/axios';
import UserContext from '../../context/user/userContext';
import MessagesContext from '../../context/messages/messagesContext';
import Modal from '../elements/Modal';


const Profile = (props) => {

    const { authenticated, user } = useContext(UserContext);
    const { sendMessage } = useContext(MessagesContext)

    const [currentUserProfile, setCurrentUserProfile] = useState({
        avatar: '',
        status: '',
        thoughts: [],
        username: '',
        name: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState({});
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const { accountId } = useParams();

    useEffect(() => { //Unificar context user, para qe no fetchee siempre
        // if (user._id === accountId) {
        //     setCurrentUserProfile({
        //         avatar: user.avatar,
        //         status: user.settings.status,
        //     });
        // } else {
        //     console.log('se loguea?', accountId);
        getUserInfo();
        // }
        //eslint-disable-next-line
    }, [user])




    const getUserInfo = async () => {
        try {
            const response = await axiosConfig.get(`/user/${accountId}`);
            setCurrentUserProfile(response.data.data);
        } catch (err) {
            console.log(err)
            setError(true);
        }
        setLoading(false);
    };

    const onSendMessageHandler = async (e, message) => {
        setLoading(true);
        e.preventDefault();
        const sentStatus = await sendMessage(message);
        setModalAction({ fn: () => props.history.push('/'), type: sentStatus });
        setShowModal(true);
        setLoading(false);
    }

    return (
        <>
            {showModal ? (
                <Modal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    modalAction={modalAction}
                />) : null}
            {!error ? (

                <GeneralPanelBox>

                    <h2
                        className="mt-4"
                    >{user._id === accountId
                        ? 'My Profile'
                        : `Profile of ${currentUserProfile.name}`
                        }
                    </h2>

                    <Avatar
                        avatar={showedAvatar(currentUserProfile.avatar)}
                        size='6rem'
                    />

                    <h3 className="mt-3">{currentUserProfile.status}</h3>

                    {authenticated && !(user._id === accountId)
                        ? (
                            <MessageBox
                                sendTo={currentUserProfile.name}
                                width="75"
                                onSendMessageHandler={onSendMessageHandler}
                                sendToId={accountId}
                            />
                        )
                        : null}
                    <h4 className="mt-4"><strong>Recent Thoughts: </strong></h4>

                    {currentUserProfile.thoughts.map(thought => (
                        <Link
                            to={`/thoughts/${thought._id}`}
                            className="rounded px-3 py-2 h5 m-1 text-decoration-none"
                            key={thought._id}
                            style={{ background: 'var(--secondary-muted)', color: 'var(--terciary)' }}
                        ><strong>{thought.content}</strong></Link>
                    ))}
                </GeneralPanelBox>
            ) : (
                    <NotFoundBox>
                        <h2>Profile not found.</h2>
                        <p>You're going to be redirected to home, if you are not redirected,
                    click <Link
                                to="/"
                                style={{ textDecoration: 'none', fontWeight: 'bold', color: 'var(--secondary)' }}
                            >here</Link></p>
                        {driveHome(props.history)}
                    </NotFoundBox>
                )}

            {loading ? <Spinner /> : null}
        </>
    );
}

export default Profile;