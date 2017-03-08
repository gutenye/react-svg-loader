import React from 'react'
import { render } from 'react-dom'
import IconDummy from './dummy.svg'
import IconProducts from './products.svg'

class App extends React.Component {
  render() {
    return (
      <div>
        <IconDummy button gray id='id'/>
        <IconProducts />
      </div>
    )
  }
}

render(<App />, document.querySelector('#app'))
