import React from 'react'
import PropTypes from 'prop-types'

import { Book } from './Book'
import { Hiring } from './Hiring'
import { NotHiring } from './NotHiring'

class Library extends React.Component {
    static defaultProps = {
        books: [
            { title: 'Tahoe Tales', author: 'Chet Whitley', pages: '1000' }
        ],
    }

    static propTypes = {
        books: PropTypes.array,
    }

    state = {
        open: true,
        freeBookmark: false,
        hiring: true,
        data: [],
        loading: false,
    }

    async componentDidMount() {
        this.setState({ loading: true })
        const response = await fetch('https://hplussport.com/api/products/order/price/sort/asc/qty/1')
        const data = await response.json()
        this.setState({ data, loading: false })
    }

    render() {
        const { open, freeBookmark, hiring } = this.state
        const { books } = this.props
        return (
            <div>
                {hiring ? <Hiring /> : <NotHiring />}
                {this.state.loading
                    ? <p>Loading library product of the week...</p>
                    : <div>
                        {this.state.data.map(product =>
                            <div key={product.id}>
                                <h3>Library Product of the Week!</h3>
                                <h4>{product.name}</h4>
                                <img src={product.image} height={100} alt={product.name} />
                            </div>
                        )}
                    </div>}
                <h1>The library is {open ? 'open' : 'closed'}.</h1>
                <button onClick={this.toggleOpenClosed}>{open ? 'Close' : 'Open'} the library</button>
                {books.map(
                    (book, i) =>
                        <Book
                            key={i}
                            title={book.title}
                            author={book.author}
                            pages={book.pages}
                            freeBookmark={freeBookmark}
                        />
                )}
            </div>
        )
    }

    toggleOpenClosed = () => {
        this.setState(prevState => ({
            open: !prevState.open
        }))
    }
}

export default Library
