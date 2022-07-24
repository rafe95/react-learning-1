import React from 'react'
import './App.css'
import {List} from "./components/List.jsx";
import {InputWithLabel} from "./components/InputWithLabel.jsx";

const listReducer = (state, action) => {
    switch (action.type) {
        case "STORIES_FETCH_INIT":
            return {
                ...state,
                isLoading: true,
                isError: false,
            }
        case "STORIES_FETCH_SUCCESS":
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload,
            };
        case "STORIES_FETCH_FAILURE":
            return {
                ...state,
                isLoading: false,
                isError: true,
            };
        case 'REMOVE_STORY':
            return {
                ...state,
                data: state.data.filter(
                    (story) => action.payload.id !== story.id
                ),
            };
        default:
            throw new Error();
    }
}

const useSemiPersistentState = (key, initialState) => {
    const [value, setValue] = React.useState(localStorage.getItem(key) || initialState)

    React.useEffect(() => {
        localStorage.setItem(key, value)
    }, [value, key])

    return [value, setValue]
}

const App = () => {

    const initList = [
        {id: 'str0', invention: 'Telephone', author: 'Graham Bell'},
        {id: 'str1', invention: 'The Revolution', author: 'Robespierre'},
        {id: 'str2', invention: 'The Republic', author: 'Plato'}
    ]

    const getAsyncList = () => {
        return new Promise(
            (resolve) => setTimeout(
                () => resolve(
                    {data: {list: initList}}), 2000
            )
        )
    }

    //const [searchTerm, setSearchTerm] = React.useState(localStorage.getItem('search') || 'React')
    const [searchTerm, setSearchTerm] = useSemiPersistentState(
        'search', ''
    )

    //const [theList, setTheList] = React.useState([]);
    //const [isLoading, setIsLoading] = React.useState(false);
    //const [isError, setIsError] = React.useState(false);

    const [theList, dispatchList] = React.useReducer(
        listReducer, {data: [], isLoading: false, isError: false}, (it) => it);

    React.useEffect(() => {
        dispatchList({type: 'STORIES_FETCH_INIT'});

        getAsyncList().then(({data}) => {
            dispatchList({
                type: 'STORIES_FETCH_SUCCESS',
                payload: data.list
            });
        }).catch((error) => {
            dispatchList({type: 'STORIES_FETCH_FAILURE'})
            console.log(error)
        })
    }, []);

    const handleRemoveElement = (toRemove) => {
        dispatchList({
            type: "REMOVE_STORY",
            payload: toRemove
        })
    }

    const handleSearch = (event) => {
        setSearchTerm(event.target.value)
    }

    const searchedItems = theList.data.filter((item) => item.author
        .toLowerCase()
        .includes(
            searchTerm
                .toLowerCase()
        )
    );

    return (
        <div className="App">
            <h1>Hacker stories app</h1>
            <InputWithLabel
                id="search"
                value={searchTerm}
                isFocused
                onInputChange={handleSearch}
            >
                <strong>Search:</strong>
            </InputWithLabel>
            <hr/>
            {theList.isError && <p>Something went wrong ...</p>}

            {
                theList.isLoading
                    ? (<p>Loading...</p>)
                    : (<List list={searchedItems} onRemoveItem={handleRemoveElement}/>)
            }

        </div>
    )
}


export default App
