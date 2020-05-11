import React, { Component } from 'react'
import { connect } from 'react-redux'

export class Input extends Component {
  render() {
    return (
      <div>
        Input Box
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Input)
