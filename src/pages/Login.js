import { map } from "async";
import { Component, createElement } from "react";
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Welcome from '../components/Welcome'

function onLogin(){
    var CLIENT_ID = '22ca38327ff8436cbf97e5979d2eb063';
    var REDIRECT_URI = 'http://localhost:3000'; 
    function getLoginURL(scopes) {
        return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
            '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
            '&scope=' + encodeURIComponent(scopes.join(' ')) +
            '&response_type=token';
    }
    var url = getLoginURL([
        'user-top-read'
    ])
    window.location = url;
}

var numberOfParticle = 0;
function testParticle(){
  numberOfParticle += 1;
  console.log(`test particle ${numberOfParticle}`);
  //dispatch(addTodo(numberOfParticle))
  // ReactDOM.render(
  //   <Visualize numberOfParticle={numberOfParticle} />,
  //   document.getElementById('root')
  // );
  return numberOfParticle;
}


class LoginComponent extends Component {

  constructor (props){
    super(props);
    
    console.log(props);
  } 

  test = () => {
    let particles = [];
    particles.push('A')
    particles.push('B')
    particles.push('C')
    particles.push('D')
    particles.push('E')
    

    this.props.dispatch({ type: "PARTICLES", particles:particles })
    console.log('dispatched');
  }

  render(){
    return (
        <Welcome />
        // {/* <button onClick={onLogin}>
        //     Connect spotify
        // </button>
        // <button onClick={this.test}>
        //     add five particles
        // </button> */}
    )
  }
}
const mapStateToProps = (state, ownProps) => ({
  numberOfParticle: state.numberOfParticle
})
// const mapDispatchToProps = (dispatch, ownProps) => ({
//   numberOfParticle: () => dispatch({ type: "TEST", numberOfParticle:this.numberOfParticle })
// })
export default connect(mapStateToProps)(LoginComponent) 