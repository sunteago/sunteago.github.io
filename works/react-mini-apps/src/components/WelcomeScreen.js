import React, {useContext } from 'react';
import LangContext from '../context/langContext';
import { Link } from 'react-router-dom';

const WelcomeScreen = ({ firstPage, name, setName, isNameSetted, setIsNameSetted }) => {
    const langCtx = useContext(LangContext);

    const welcomeTexts = {
        welcome: { es: 'Bienvenido ', en: 'Welcome' },
        intro: {
            es: 'Aqui tienes a disposición estas maravillosas herramientas que he creado para ti',
            en: 'Here you have available this wonderful tools that I created for you'
        },
        startNow: { en: 'Get Started now!', es: 'Empieza ya mismo!' },
        resetname: { en: 'Reset name', es: 'Reiniciar nombre' },
        willRememberYou: {
            en: 'You can submit your name, the next time we will remember you!',
            es: 'Puedes introducir tu nombre si deseas, la proxima vez te recordaremos!'
        },
        putName: { en: 'Submit name', es: 'Introducir nombre' },
        changeName: (lang) => {
            if (lang === 'es') {
                return `No sos ${name}?, Clickea el siguiente botón para reiniciar e introducir TU nombre!`
            }
            return `Aren't you ${name}?, Click the following button to reset and put YOUR name`
        },

    }

    const onResetHandler = e => {
        e.preventDefault();
        localStorage.removeItem('name');
        setName('');
        setIsNameSetted(false);
    };

    const onSubmitNameHandler = e => {
        e.preventDefault();
        localStorage.setItem('name', name);
        setIsNameSetted(true);
    };

    return (
        <div className="jumbotron">
            <h1 className="display-4">{welcomeTexts.welcome[langCtx]} {name}</h1>
            <p>{welcomeTexts.intro[langCtx]}</p>
            <p className="lead">
                <Link
                    to={firstPage}
                    className="btn btn-primary btn-lg"
                >{welcomeTexts.startNow[langCtx]}</Link>
            </p>
            <hr className="my-4" />
            <div className="w-100 d-inline-flex flex-column justify-content-end align-items-center ">
                {isNameSetted ? (
                    <>
                        <p className="lead m-3">{welcomeTexts.changeName(langCtx)}</p>
                        <button
                            className="form-control m-3 btn-outline-primary w-50"
                            onClick={onResetHandler}
                        >{welcomeTexts.resetname[langCtx]}</button>
                    </>
                ) : (
                        <>
                            <p className="lead">{welcomeTexts.willRememberYou[langCtx]}</p>
                            <form className="d-flex form-inline">
                                <input
                                    type="text"
                                    className="form-control m-3"
                                    onChange={e => setName(e.target.value)}
                                />
                                <input
                                    type="submit"
                                    value={welcomeTexts.putName[langCtx]}
                                    className="form-control btn m-3 btn-primary"
                                    onClick={onSubmitNameHandler}
                                />
                            </form>
                        </>
                    )}
            </div>
        </div>
    );
}

export default WelcomeScreen;