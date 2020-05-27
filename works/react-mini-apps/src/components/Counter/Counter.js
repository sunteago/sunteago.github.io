import React, { useState, useContext} from 'react';
import Button from './Button';
import LangContext from '../../context/langContext';

const Counter = ({ makeTitle, boxQuality}) => {
    const [counter, setCounter] = useState(0);
    
    const langCtx = useContext(LangContext);

    const title = langCtx === 'es' ? 'Contador' : 'Counter';
    const clickMe = langCtx === 'es' ? 'Clickeame' : 'Click me';
    
    const renderPoints = () => {
        let points = '';
        for (let i = 0; i < counter; i++) {
            points += '. ';
        }
        return points;
    }
    return (
        <div className={`${boxQuality} justify-content-center`}>
            {makeTitle(title)}
            <Button
                clickMe={clickMe}
                counter={counter}
                setCounter={setCounter}
            />
            <h4 className="h4 text-center">{renderPoints()}</h4>
        </div>
    );
}

export default Counter;