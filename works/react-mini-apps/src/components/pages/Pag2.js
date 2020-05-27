import React, { Fragment } from 'react';
import Metronome from '../Metronome/Metronome';
import URLShortener from '../URLShortener/URLShortener';
import LordOfTheRings from '../LordOfTheRings/';
import Weather from '../Weather/';

function Pag2({ boxQuality, makeTitle }) {
    return (
        <Fragment>
            <Metronome
                boxQuality={boxQuality}
                makeTitle={makeTitle}
            />
            <URLShortener
                boxQuality={boxQuality}
                makeTitle={makeTitle}
            />
            <LordOfTheRings
                boxQuality={boxQuality}
                makeTitle={makeTitle}
            />
            <Weather
                boxQuality={boxQuality}
                makeTitle={makeTitle}
            />
        </Fragment>
    )
}

export default Pag2;

