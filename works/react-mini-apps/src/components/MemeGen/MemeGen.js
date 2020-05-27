import React, { useContext, useEffect, useState, useRef } from 'react';
import LangContext from '../../context/langContext';

const texts = {
    textTop: {
        en: 'Top text',
        es: 'Texto superior'
    },
    textBottom: {
        en: 'Bottom text',
        es: 'Texto inferior'
    },
    button: {
        en: 'Generate meme',
        es: 'Generar meme'
    },
    buttonProcess: {
        en: 'Generating',
        es: 'Generando'
    },
    title: {
        en: 'Meme Generator',
        es: 'Generador de memes'
    }
}

const MemeGen = ({ boxQuality, makeTitle }) => {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState({});
    const [textInput, setTextInput] = useState({
        textTop: '',
        textBottom: ''
    })
    const [generatedMeme, setGeneratedMeme] = useState({});
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false);

    const linkRef = useRef(null);

    const langCtx = useContext(LangContext);

    useEffect(() => {
        if (Object.keys(options).length === 0) {
            const makeInitialReq = async () => {
                const url = "https://api.imgflip.com/get_memes";
                const res = await fetch(url);
                const data = await res.json();
                setOptions(data.data.memes);
                setSelectedOption(data.data.memes[2]);
            }
            makeInitialReq();
        }
    }, [options]);

    const selectMeme = e => {
        const newOpt = options.find(option => option.name === e.target.value);
        setSelectedOption(newOpt);
    }

    const onChangeTextHandler = e => {
        setTextInput({
            ...textInput,
            [e.target.name]: e.target.value
        })
    };

    const makeMemePostReq = async () => {
        const username = 'sunteago';
        const password = 'password12';
        const url = `https://api.imgflip.com/caption_image?username=${username}&password=${password}&template_id=${selectedOption.id}&text0=${textInput.textTop}&text1=${textInput.textBottom}`;
        const req = await fetch(url, { method: 'POST' });
        const res = await req.json();
        setGeneratedMeme(res.data);
        setLoading(false);
    }

    const onClickHandler = () => {
        const { textTop, textBottom } = textInput;
        if (textTop.trim() === '' && textBottom.trim() === '') {
            setError(true);
            return;
        }
        setLoading(true);
        setError(false);
        makeMemePostReq();
    };

    const onCopyButtonHandler = e => {
        e.preventDefault();
        linkRef.current.select();
        document.execCommand("copy");
    };

    return (
        <div className={`${boxQuality} col-md-10`}>
            {makeTitle(texts.title[langCtx])}
            <div className="d-flex d-md-block container align-items-center border-none flex-column flex-md-row ">
                {selectedOption ? (
                    <div className="row row-eq-height">
                        <div className="col-12 col-md-5 pt-5 pb-0 py-md-5 d-flex flex-column align-items-center">
                            <form
                                onSubmit={(e) => e.preventDefault()}
                            >
                                <select
                                    className="form-control mt-2"
                                    value={selectedOption.name}
                                    onChange={selectMeme}
                                >
                                    {options.map(option => (
                                        <option
                                            key={option.id}
                                            value={option.name}
                                        >{option.name}</option>
                                    ))}
                                </select>

                                <input
                                    className="form-control mt-2"
                                    type="text"
                                    name="textTop"
                                    placeholder={texts.textTop[langCtx]}
                                    onChange={onChangeTextHandler}
                                    value={textInput.textTop}
                                />
                                <input
                                    className="form-control mt-2"
                                    type="text"
                                    name="textBottom"
                                    placeholder={texts.textBottom[langCtx]}
                                    onChange={onChangeTextHandler}
                                    value={textInput.textBottom}
                                />
                                <button
                                    type="submit"
                                    className="btn btn-primary form-control my-2"
                                    onClick={onClickHandler}
                                >
                                    {loading
                                        ? (
                                            <>
                                                <span
                                                    role="status"
                                                    aria-hidden="true"
                                                    className="mr-1 spinner-border spinner-border-sm"
                                                ></span>{texts.buttonProcess[langCtx]}
                                            </>
                                        ) : texts.button[langCtx] }
                                </button>
                            </form>
                            <img
                                className="img-thumbnail"
                                src={selectedOption.url}
                                alt={selectedOption.name}
                            />

                        </div>
                        <div className="col-12 col-md-7 d-flex flex-column align-items-center py-0 py-md-5">
                            {error ? <p className="mt-3 mt-md-0 align-self-center alert alert-warning"> Por favor completa al menos un campo</p> : null}
                            {Object.keys(generatedMeme).length !== 0 ? (
                                <>

                                    <img
                                        className="p-0 p-md-5 img-fluid img-thumbnail"
                                        src={generatedMeme.url}
                                        alt="Meme generado"
                                    />
                                    <form className="d-flex m-3 form-inline flex-md-nowrap mb-2">
                                        <input
                                            className="form-control"
                                            type="url"
                                            ref={linkRef}
                                            readOnly
                                            value={generatedMeme.url}
                                        />
                                        <input
                                            type="button"
                                            value="Copiar"
                                            className="btn btn-primary ml-2"
                                            onClick={onCopyButtonHandler}
                                        />
                                    </form>
                                </>
                            ) : null}
                        </div>

                    </div>
                ) : null}
            </div>

        </div>

    );
}

export default MemeGen;