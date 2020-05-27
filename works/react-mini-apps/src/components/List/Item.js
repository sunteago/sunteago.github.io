import React, {useContext} from 'react';

function Item({id, task, done, onUpdateClickHandler, onDeleteClickHandler, langCtx}) {


    const texts = {
        finished: {en: 'Finished',es: 'Finalizado'},
        pending: {en: 'Pending', es: 'Pendiente'}
    }
    return (
        <li
            className="m-2 p-1 d-flex align-items-center justify-content-between w-75"
        >
            <span
                className="text-primary"
            >{task}</span>
            <button
                className={done ? "btn btn-primary mx-2 py-2 px-3" : "btn btn-secondary mx-2 py-2 px-3"}
                onClick={() => onUpdateClickHandler(id)}
            >{done ? texts.finished[langCtx] : texts.pending[langCtx]}</button>
            <a
                href="/#"
                style={{ textDecoration: 'none', color: 'black' }}
                onClick={(e) => onDeleteClickHandler(e, id)}
            ><span>&#9587;</span></a>
        </li>
    )
}

export default Item;
