import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import  LangContext  from '../context/langContext';


function Navbar({ name, setLang, lang }) {
    const langCtx = useContext(LangContext);
        
    //Texts
    const page = {en: 'Page', es: 'Pagina'};
    const loggedInAs = () => {
        if (langCtx === 'es') {
            return name ? `Iniciado como: ${name}` : `Pon tu nombre aqui`;
        }
        return name ? `Logged in as: ${name}` : `Put your name here`;
    }

    const onChangeLangHandler = () => {
        const currLang = lang === 'es' ? 'en' : 'es';
        setLang(currLang);
        localStorage.setItem('lang', currLang)
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <Link to="/" className="navbar-brand">Toolz</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav">
                    <li><Link to="/pag1" className="nav-link">{page[langCtx]} 1</Link></li>
                    <li><Link to="/pag2" className="nav-link">{page[langCtx]} 2</Link></li>
                    <li><Link to="/pag3" className="nav-link">{page[langCtx]} 3</Link></li>
                    <li><Link to="/pag4" className="nav-link">{page[langCtx]} 4</Link></li>
                </ul>

                <Link
                    to="/"
                    className="text-light my-0  ml-auto text-decoration-none"
                >{loggedInAs()}</Link>
                    <button
                    className="btn btn-dark ml-2"
                    style={{boxShadow: 'none'}}
                    onClick={onChangeLangHandler}
                >{lang === 'es' ? 'ES' : 'EN'}</button>

            </div>
        </nav>
    )
}

export default Navbar;
