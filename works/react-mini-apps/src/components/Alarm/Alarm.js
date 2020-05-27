import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import alarmSound from '../../sounds/clock-sound.mp3';
import { Transition } from 'react-transition-group';
import langText from './lang';
import LangContext from '../../context/langContext';

//importante definir afuera
const music = document.createElement("audio");
music.loop = true;
music.src = alarmSound;

//animations
const DURATION = 500;
const clockStyles = {
    transition: `opacity ${DURATION}ms ease-in-out`,
    opacity: 1
}
const transitionStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
}

const Alarm = ({ msg, boxQuality, makeTitle }) => {
    const [watch, setWatch] = useState({
        currTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
        alarmTime: ''
    })
    const [alarmOn, setAlarmOn] = useState(false);
    const [animate, setAnimate] = useState(false);
    // No funciona y quien sabe por que
    //    const updateClock = () => {
    //    let currTime = new Date().toLocaleTimeString('en-US', { hour12: false });
    //    setWatch({
    //            ...watch, currTime
    //        }
    //    );
    //}
    //si no estoy mal, debe ser que el primero, al no mergearlo, crea todo devuelta
    //lo que genera que se me reemplace otra vez
    //https://stackoverflow.com/questions/55342406/updating-and-merging-state-object-using-react-usestate-hook
    // const audio = new Audio(alarmSound);

    const langCtx = useContext(LangContext);

    const updateClock = () => {
        setWatch(prev => {
            let currTime = new Date().toLocaleTimeString('en-US', { hour12: false })
            return {
                ...prev, currTime
            }
        });
        setAnimate(true);
    }
    const onChangeAlarmHour = e => {
        setWatch({
            ...watch,
            alarmTime: e.target.value
        });

    };
    /*   solucion a que se intente actualizar el componente estando desmontado
     /   con return dentro de useEffect ejecutamos lo que se necesite al desmontarse 
     /   el componente, para realizar la limpieza
     /   La limpieza funciona porque es asyncrono, en Metronome esto no funciona, asi que
     /  simplemente llamo a limpiar el interval  desde lo que retorno
     */
    useEffect(() => {
        let isCancelled = false;
        setInterval(() => {
            if (!isCancelled) {
                updateClock();
            }
        }, 1000);

        return () => {
            isCancelled = true;
        }
    }, []);

    const playSound = (action) => {
        action === 'play' ? music.play() : music.pause();
    };

    useEffect(() => {
        if (watch.alarmTime === watch.currTime.toString().substr(0, 5)) {
            setAlarmOn(true);
            return
        }
        setAlarmOn(false);
    }, [watch]);

    useEffect(() => {
        alarmOn ? playSound('play') : playSound('stop');
    }, [alarmOn]);

    const alarmOnOrOff = () => {//importante convertir a string porque da error...
        return alarmOn
            ? <p className='text-center bg-danger text-white p-3'>{langText.isSounding[langCtx]}</p>
            : <p className='text-center bg-info text-light p-3'>{langText.noAlarm[langCtx]}</p>
    }

    return (
        <div className={boxQuality}>
            {makeTitle(langText.title[langCtx])}
            <h4 className="mt-2">{langText.currTime[langCtx]}:
                <Transition in={animate} timeout={DURATION} onEntered={() => setAnimate(false)} >
                    {state => {
                        // console.log(state);
                        return (
                            (
                                <span
                                    style={{ ...clockStyles, ...transitionStyles[state] }}
                                >{watch.currTime}</span>
                            )
                        )
                    }}
                </Transition>
            </h4>
                <h4>{langText.setAlarm[langCtx]}</h4>
            <input
                type="time"
                name="alarm"
                value={watch.alarmTime}
                onChange={onChangeAlarmHour}
                className='p-1 text-center'
            />
            <p>{!watch.alarmTime
                ? langText.isNotSetted[langCtx]
                : `${langText.isSetted[langCtx]} ${watch.alarmTime}`}
            </p>
            {alarmOnOrOff()}
        </div>
    )
}

export default Alarm;