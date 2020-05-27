import React, {useState, useContext} from 'react';
import axios from 'axios';
import LangContext from '../../context/langContext';

const texts = {
    ShortenURL: {
        en: 'Here will be the shortened URL',
        es: 'Aqui aparecera la URL acortada'
    },
    textShorten: {
        en: 'Shortened URL',
        es: 'URL Acortada'
    },
    title: {
        en: 'URL shortener',
        es: 'Acortados de URLs'
    },
    shortURLButton: {
        en: 'Short URL',
        es: 'Acortar URL'
    }

}

const URLShortener = ({ makeTitle , boxQuality}) => {
    const [url, setUrl] = useState('http://www.github.com');
    const [shortenUrl, setShortenUrl] = useState(null);
    
    const langCtx = useContext(LangContext);

    const onChangeUrlHandler = e => {
        setUrl(e.target.value);
    };
    const onClickButtonHandler = e => {
        e.preventDefault();
        axios.get(`https://api.shrtco.de/v2/shorten?url=${url}`)
            .then(res => setShortenUrl(`https://${res.data.result.short_link2}`))
            .catch(error => console.log(error));
    };

    return (
        <div className={boxQuality}>
            {makeTitle(texts.title[langCtx])}
            <input
                type="url"
                className="mt-3 text-center"
                onChange={onChangeUrlHandler}
                value={url}
            />
            <input
                type="button"
                className="mt-3 text-center btn btn-primary"
                onClick={onClickButtonHandler}
                value={texts.shortURLButton[langCtx]}
            />
            <p className="mt-3 text-center">{texts.textShorten[langCtx]}:</p>
            <a
                className="text-center"
                href={shortenUrl}
                target="_blank"
                rel="noopener noreferrer"
            >{shortenUrl ? shortenUrl : texts.ShortenURL[langCtx]}</a>
        </div>
    )
};

export default URLShortener;