import React, { useState, useEffect, useContext } from 'react';
import click1 from '../../sounds/1.wav';
import click2 from '../../sounds/2.wav'
import LangContext from '../../context/langContext';

const Metronome = ({ makeTitle, boxQuality }) => {
    const [bpm, setBPM] = useState(120);
    const [playing, setPlaying] = useState(false);
    const [clearInt, setClearInt] = useState([[],0]);

    const langCtx = useContext(LangContext);

    const titleText = langCtx === 'es' ? 'Metronomo' : 'Metronome';
    const pausedStatus = langCtx === 'es' ? 'Pausado' : 'Paused';
    const playingStatus = langCtx === 'es' ? 'Reproduciendo' : 'Playing';

    const tick = new Audio(click1);
    const tack = new Audio(click2);

    const calculateMs = bpm => 60000 / bpm;

    const playMetronome = interv => {
        const tOutIds = [];
        const metronome = () => {
            tick.play();
            tOutIds[0] = setTimeout(() => tack.play(), interv);
            tOutIds[1] = setTimeout(() => tack.play(), interv * 2);
            tOutIds[2] = setTimeout(() => tack.play(), interv * 3);
        }
        metronome();
        const intId = setInterval(() => metronome(), interv * 4);
        return [tOutIds, intId];
    }

    const onChangeHandler = e => {
        e.preventDefault();
        setBPM(Number(e.target.value));
    }

    const onClickButtonHandler = e => {
        if (e.target.value === '+') setBPM(bpm + 4);
        else if (e.target.value === '-') setBPM(bpm - 4);
        else setPlaying(!playing);
    }

    const clearIntervals = () => {
        for (const intId of clearInt[0]) {
            clearTimeout(intId);
        }
        clearInterval(clearInt[1]);
    }

    useEffect(() => {
        if (playing) {
            const ids = playMetronome(calculateMs(bpm));
            setClearInt(ids);
        } 
        clearIntervals();
    
        //eslint-disable-next-line
    }, [bpm, playing]);

    // useEffect(() => {
    //     return () => console.log('unmount');
    // }, [])

    
    // Es como que no conoce el nuevo valor de clearInt esta funcion
    // no pude encontrar nueva documentacion acerca de esto
    useEffect(() => {
        return () => {
            clearIntervals();
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[clearInt])

    return (
        <div className={boxQuality}>
            {makeTitle(titleText)}
            <p className="text-center">{`${bpm} BPM`}</p>
            <input
                type="range"
                min="40"
                max="200"
                value={bpm}
                onChange={onChangeHandler}
                className="mt-1 w-100"
            />
            <div className="mb-2 d-flex justify-content-center flex-wrap">
                <button
                    className="btn btn-primary w-25 mx-3"
                    onClick={onClickButtonHandler}
                    value="+"
                >+</button>
                <button
                    className="btn btn-primary w-25 mx-3"
                    onClick={onClickButtonHandler}
                    value="-"
                >-</button>
            </div>
            <button
                className="btn btn-primary py-2 px-3 mb-4 mt-4 w-25 m-auto"
                onClick={onClickButtonHandler}
            >Click
            </button>
            <h4
                className="text-center mb-4"
            >{playing ? playingStatus : pausedStatus} </h4>
        </div>
    )
};

export default Metronome;