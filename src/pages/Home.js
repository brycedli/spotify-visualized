import { map } from "async";
import { Component, createElement } from "react";
import { connect } from 'react-redux'
import Welcome from './Welcome'

class Home extends Component {

  render(){
    return (
        <Welcome />
    )
  }
}
const mapStateToProps = (state, ownProps) => ({
  session: state.session
})

export default connect(mapStateToProps)(Home) 