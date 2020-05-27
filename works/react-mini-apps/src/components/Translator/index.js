import React, { useState, useEffect, useContext} from 'react';
// import api from './api';
import axios from 'axios';
import LangContext from '../../context/langContext';
import texts from './lang';
const Translator = ({ boxQuality, makeTitle }) => {
    const [listOfLangs, setListOfLangs] = useState([]);
    const [lang, setLang] = useState('');
    const [text, setText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [error, setError] = useState(false);

    const langCtx = useContext(LangContext);



    const getLanguages = async () => {
        const url = 'https://translate.yandex.net/api/v1.5/tr.json/getLangs';
        const key = 'trnsl.1.1.20200414T043542Z.1e23df8d236e147c.b9a218f1f5edd2c4f4cb3506738127aa0228f1d0';
        const res = await axios.get(`${url}?key=${key}`);
        setListOfLangs(res.data.dirs);
        setLang('en-es');
    }

    const sendTextToTranslate = async () => {
        const url = 'https://translate.yandex.net/api/v1.5/tr.json/translate';
        const key = 'trnsl.1.1.20200414T043542Z.1e23df8d236e147c.b9a218f1f5edd2c4f4cb3506738127aa0228f1d0';
        const res = await axios.get(`${url}?key=${key}&text=${text}&lang=${lang}&format=plain`)
        setTranslatedText(res.data.text[0]);
    }

    const onSubmitHandler = () => {
        if(text.trim() === '') {
            setError(true);
            return;
        }
        setError(false);
        sendTextToTranslate();
    }

    useEffect(() => {
        getLanguages();
    }, []);


    return (
        <div className={boxQuality}>
            {makeTitle(texts.title[langCtx])}
            <select
                className="mt-3 form-control form-control-sm"
                onChange={e => setLang(e.target.value)}
                value={lang}
            >
                {listOfLangs.map(opt => {
                    return <option value={opt} key={Math.random()}>{opt}</option>
                })}
            </select>
            <textarea
                style={{ resize: 'none' }}
                className="mt-3 form-control"
                placeholder={texts.textareaToTranslate[langCtx]}
                onChange={e => setText(e.target.value)}
                value={text}
            ></textarea>
            <textarea
                style={{ resize: 'none' }}
                readOnly
                className="mt-3 form-control"
                placeholder={texts.textAreaTranslated[langCtx]}
                value={translatedText}
            ></textarea>
            {error ? <p className="alert alert-danger my-3">{texts.error[langCtx]}</p> : null}
            <button
                onClick={onSubmitHandler}
                className="btn btn-primary mt-3"
            >{texts.translateBtn[langCtx]}</button>
        </div>
    );
};

export default Translator;