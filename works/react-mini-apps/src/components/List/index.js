import React, { useState, useEffect, useContext } from 'react'
import AddItem from './AddItem';
import Item from './Item';
import LanguageContext from '../../context/langContext';

const List = ({ makeTitle, boxQuality }) => {
    const [list, setList] = useState([])
    
    const langCtx = useContext(LanguageContext);

    const title = langCtx === 'es' ? 'Lista de que hacer' : 'To-do list';

    const onUpdateClickHandler = id => {
        setList(list.map(item => item.id === id ? {...item, done: !item.done}: item))  
    };

    const onDeleteClickHandler = (e, id) =>{
        e.preventDefault();
        setList([...list.filter(item => item.id !== id)])
    }

    useEffect(() => {
        const savedList = JSON.parse(localStorage.getItem('todoList'));
        if (localStorage.getItem('todoList')) {
            setList(savedList);
        }
    },[])
    useEffect(() => {
        localStorage.setItem('todoList', JSON.stringify(list));
    }, [list])

    return (
        <div className={boxQuality}>
            {makeTitle(title)}
            <AddItem
                list={list}
                setList={setList}
                langCtx={langCtx}
            />
            <ul className="list-unstyled d-flex w-100 justify-content-center flex-wrap">
                {list.map(item => (
                    <Item
                        key={item.id}
                        id={item.id}
                        task={item.task}
                        done={item.done}
                        onUpdateClickHandler={onUpdateClickHandler}
                        onDeleteClickHandler={onDeleteClickHandler}
                        langCtx={langCtx}
                    />
                ))}
            </ul>

        </div>
    );
}

export default List;