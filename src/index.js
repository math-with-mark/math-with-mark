import React from 'react'
import { render } from 'react-dom'

import Library from './Library'

let bookList = [
    { title: "The Sun Also Rises", author: "Ernest Hemingway", pages: 260 },
    { title: "The Circle", author: "Dave Eggers", },
]

render(
    <Library books={bookList} />,
    document.getElementById('root')
);
