import React, { useState, Fragment } from 'react'


const texts = {
    completeFieldPlease: {
        en: 'Please, complete the required field',
        es: 'Por favor, completa el campo obligatorio'
    },
    addItem: {
        en: 'Add Item',
        es: 'Agregar item'
    }

}

const AddItem = ({ list, setList, langCtx }) => {
    const [item, setItem] = useState('');
    const [error, setError] = useState(false);

    const onSubmitEventHandler = e => {
        e.preventDefault();
        if (item.trim() === '') {
            setError(true);
            return;
        }

        setError(false);

        const newItem = {
            task: item,
            done: false,
            id: Math.random().toFixed(5)
        }

        setList([
            ...list,
            newItem
        ])

        setItem('');
    }
    const onChangeInputHandler = e => {
        setItem(e.target.value);
    };

    return (
        <Fragment>
            {error ? <span className="alert alert-danger text-center d-inline">
                {texts.completeFieldPlease[langCtx]}
                    </span> : null}
            <form
                className="d-flex flex-lg-row flex-column  justify-content-between mx-auto mb-3 "
                onSubmit={onSubmitEventHandler}
            >
                <input
                    type="text"
                    className="p-2 mr-lg-3 mb-lg-0 mb-3"
                    placeholder="Item"
                    value={item}
                    onChange={onChangeInputHandler}
                />
                <input
                    type="submit"
                    value={texts.addItem[langCtx]}
                    className="py-2 px-3 btn btn-primary"
                />
            </form>
        </Fragment>
    );
}

export default AddItem;