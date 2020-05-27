/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import lotr from './api';
import LangContext from '../../context/langContext';

const LordOfTheRings = ({ boxQuality }) => {
    const [quotes, setQuotes] = useState({ quotesArr: [], numOfQuotes: 0 });
    const [currQuote, setCurrQuote] = useState({});
    const [author, setAuthor] = useState('');
    const [spinner, setSpinner] = useState(true);

    const langCtx = useContext(LangContext);

    const makeMainRequest = async () => {
        const response = await lotr.get('/quote')
        setQuotes({
            ...quotes,
            quotesArr: response.data.docs,
            numOfQuotes: response.data.items.total
        })
    }

    const makeSecondaryRequest = async () => {
        setAuthor('');
        const response = await lotr.get(`/character/${currQuote.character}`);
        const { name, race } = response.data;
        setAuthor({ name, race });
        setSpinner(false);
    }

    const chooseRandomQuote = () => {
        setSpinner(true);
        const randomNum = Math.floor(Math.random() * quotes.numOfQuotes);
        if (!quotes.quotesArr[0]) return;
        setCurrQuote(quotes.quotesArr[randomNum]);
    }

    useEffect(() => {
        makeMainRequest();
    }, []);

    useEffect(() => {
        if (quotes.numOfQuotes > 0) chooseRandomQuote();
    }, [quotes]);

    useEffect(() => {
        if (currQuote.dialog) makeSecondaryRequest();
    }, [currQuote]);

    return (
        <div className={`${boxQuality} text-center`}    >
            <h2>{langCtx === 'es' ? 'Frases' : 'Phrases'}</h2>
            <p> “The lord of the rings”</p>
            {spinner ? <div className="spinner-grow text-info"></div> : (
                <>
                    <button
                        className="btn btn-primary"
                        onClick={() => chooseRandomQuote()}
            >{langCtx === 'es' ? 'Nueva frase' : 'New phrase'}</button>
                    <blockquote className="blockquote mt-2 mb-0">
                        <p className="mb-0">{currQuote.dialog !== undefined ? `"${currQuote.dialog}"` : null}</p>
                    </blockquote>
                    <footer className="blockquote-footer text-right">{author ? `${author.name}, a ${author.race}` : null}</footer>
            <p className="mt-2">{langCtx === 'es' ? 'Total de frases' : 'Phrases amount'} {quotes.numOfQuotes}</p>
                </>
            )}
        </div>
    );
};

export default LordOfTheRings;