import React from 'react';

import Tilt from 'react-tilt'
import './Logo.css'
import brain from './brain1.jpg'


const Logo = () => {
    return (
        <div className='ma4 mt0 center' >
            <Tilt className="Tilt br2 shadow-2 img-center" options={{ max : 25 }} style={{ height: 200, width: 200 }} >
                <div className="Tilt-inner pa3 "> 
                    <img src={brain} alt='logo'style={{paddingTop:'5px'}} />
                </div>
                
            </Tilt>
        </div>
    )
}

export default Logo