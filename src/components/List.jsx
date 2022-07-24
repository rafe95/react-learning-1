import * as React from "react"

const List = ({list, onRemoveItem}) => {
    return list.length === 0
        ? <p>No results found</p>
        : <ul>{list.map((item) => <ListItem key={item.id} item={item} onRemoveItem={onRemoveItem}/>)}</ul>
}

const ListItem = ({item, onRemoveItem}) => (
    <li>
        {item.invention} by {item.author}
        <span>
            <button onClick={() => onRemoveItem(item)}>Dismiss</button>
        </span>
    </li>
)

export {List}

