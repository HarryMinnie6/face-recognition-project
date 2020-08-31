import React from 'react';

import './App.css';

// 3rd party dependencies
import Particles from 'react-particles-js'


//Components made by me
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkform/ImageLinkForm'
import Rank from './components/Rank/Rank'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import SignIn from './components/SignIn/SignIn'
import Register from './components/Register/Register'




 //background effect
const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}
const initialState = {
    input: '',
    imageUrl: '',
    box: {},
    route:'SignIn',  // must be spelt the same as the JS file 'SignIn.js'
    isSignedIn: false,
    user: {
      id: '',
      name: '',
      password: '',
      email: '',
      entries: 0,
      joined: ''
    }
  }



class App extends React.Component {
  constructor(){
    super()
      this.state = initialState
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      password: data.password,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})

  }

  detectFaceLocation = (data) => {
    let clarifaiFace= data.outputs[0].data.regions[0].region_info.bounding_box
    let image=document.getElementById('input-image');
    let Width = Number(image.width);
    let Height = Number(image.height);
    console.log(data.outputs[0].data.regions[0].region_info.bounding_box);
   console.log(Width,Height);
   return{
     leftCol: clarifaiFace.left_col * Width,
     topRow: clarifaiFace.top_row * Height,
     rightCol: Width - (clarifaiFace.right_col * Width),
     bottomRow: Height - (clarifaiFace.bottom_row * Height)
   }
   
  }
  displayFaceBox = (box) => {
    console.log(box);
    this.setState( {box: box} )
  }

  onInputChange = (event) => {
    this.setState( {input: event.target.value})

  }

  onPictureSubmit = () => {
      this.setState( {imageUrl: this.state.input} );
      fetch('http:localhost:3000/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if(response){
          fetch('http:localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user,{entries: count}) )
          })
          .catch(console.log)
        }
      
        
        this.displayFaceBox(this.detectFaceLocation(response)) 
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route ==='signout') {
      this.setState(initialState)
    } else if(route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
   // isSignedIn, imageUrl, route, box can be destructured to this --> const { isSignedIn, imageUrl, route, box } =this.state;
    return (
      <div>
      <Particles className='particles'  params={particlesOptions} />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange = {this.onRouteChange} />
        { this.state.route === 'home' 
          ? 
            <div>
              <Logo />
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onPictureSubmit}/>
              <Rank />
              <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
            </div> 
          : (
            this.state.route ==='SignIn' 
            ?
            <div>
            <SignIn onRouteChange = {this.onRouteChange} />
            </div>
            
            :
            <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            


          )          
    
        }
       
      </div>
    );
  }
  

  }
 
export default App;
