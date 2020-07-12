import React, { useState, useContext, useEffect } from 'react';
import styled from '@emotion/styled';
import { Avatar, GeneralPanelBox } from '../elements';
import { generateBase64FromImage, showedAvatar } from '../helpers';
import UserContext from '../../context/user/userContext';
import Modal from '../elements/Modal';

const Status = styled.textarea`
    width: 100%;
    resize: none;
`;

const Settings = (props) => {
    const userContext = useContext(UserContext);
    const { authenticated, updateSettings, user: {avatar, settings : {status, theme, privacity}}} = userContext;

    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState({});


    const [userSettings, setUserSettings] = useState({
        avatarFile: {},
        statusInput: '',
        themeInput: '',
        privacityInput: '',
        avatarPreview: '',
    });

    const { avatarPreview, avatarFile, statusInput, themeInput, privacityInput } = userSettings;


    useEffect(() => {
        setUserSettings({
            ...userSettings,
            avatarFile: {},
            statusInput: status,
            themeInput: theme,
            privacityInput: privacity
        })
        //eslint-disable-next-line
    }, [userContext.settings]);

    useEffect(() => {
        if (!authenticated) props.history.push('/');
        //eslint-disable-next-line
    }, [authenticated, props.history])


    const onSubmitSettingsHandler = async e => {
        e.preventDefault();

        const settingsForm = {
            avatar: avatarFile,
            status: statusInput,
            theme: themeInput,
            privacity: privacityInput
        }
        updateSettings(settingsForm, () => onOpenModalHandler(() => props.history.push('/')));
    }

    const onChangeSettingsHandler = async (e) => {
        let value = e.target.value;
        const name = e.target.name;
        const newState = { ...userSettings, [name]: value };
        if (e.target.files) {
            const file = e.target.files[0];
            try {
                const imageUrl = await generateBase64FromImage(file);
                value = imageUrl;
            } catch (err) {
                value = null;
            }
            newState[name] = value;
            newState.avatarFile = file;
        }
        setUserSettings(newState);
    };

    const onOpenModalHandler = (fn, id, type) => {
        setShowModal(!showModal)
        setModalAction({ fn, type: 'updateSettings' });
    }

    return (
        <>
            {showModal ? (
                <Modal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    modalAction={modalAction}
                />
            ) : null}
            <GeneralPanelBox>
                <form
                    className="d-flex flex-column align-items-center w-75 text-center rounded p-3"
                    onSubmit={onSubmitSettingsHandler}
                >
                    <h2>User settings</h2>

                    <h3>Profile</h3>
                    <Avatar
                        avatar={showedAvatar(avatarPreview, avatar)} />
                    <div className="custom-file rounded mt-3 text-left">
                        <input
                            type="file"
                            onChange={onChangeSettingsHandler}
                            name="avatarPreview"
                            id="avatar"
                            className=" custom-file-input"
                        />
                        <label htmlFor="avatar" className="custom-file-label">Avatar</label>
                    </div>
                    <label htmlFor="status" className="mt-3">Status</label>
                    <Status
                        name="statusInput"
                        id="status"
                        placeholder="This will be shown to all users"
                        className="form-control"
                        value={statusInput}
                        onChange={onChangeSettingsHandler}
                    />

                    <label htmlFor="theme" className="mt-4">Theme</label>
                    <select
                        className="form-control"
                        id="theme"
                        name="themeInput"
                        onChange={onChangeSettingsHandler}
                        value={themeInput}
                    >
                        <option value="classic">Classic</option>
                        <option value="dark">Dark</option>
                        <option value="sky">Sky</option>
                    </select>

                    <label className="mt-4" htmlFor="privacity">Privacity (who can see your messages)</label>
                    <select
                        className="form-control"
                        id="privacity"
                        value={privacityInput}
                        name="privacityInput"
                        onChange={onChangeSettingsHandler}
                    >
                        <option value="all">All</option>
                        <option value="registered">Just registered users</option>
                    </select>

                    <input
                        className="btn mt-4 btn-dark"
                        type="submit"
                        value="Save"
                    />
                </form>
            </GeneralPanelBox>
        </>
    );
}

export default Settings;
