import React from 'react'
import { render } from 'react-dom'
import IconDummy from './dummy.svg'

class App extends React.Component {
  render() {
    return (
      <div>
        <IconDummy button gray id='id'/>
      </div>
    )
  }
}

render(<App />, document.querySelector('#app'))
