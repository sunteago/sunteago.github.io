import React, { Fragment } from 'react';
import Counter from '../Counter/Counter';
import List from '../List';
import Alarm from '../Alarm/Alarm';
import Translator from '../Translator';


function Pag1({boxQuality,makeTitle}) {
    return (
        <Fragment>
            <Alarm
                boxQuality={boxQuality}
                makeTitle={makeTitle}
            />
            <Counter
                boxQuality={boxQuality}
                makeTitle={makeTitle}
            />
            <List
                boxQuality={boxQuality}
                makeTitle={makeTitle}
            />
            <Translator
                boxQuality={boxQuality}
                makeTitle={makeTitle}
            />
        </Fragment>
    )
}

export default Pag1;
