import React, { useState, useEffect } from 'react'
import { storage } from '../firebase';

export default function Not_found() {
  const [videoURL,setVideoURL] = useState()
  
  useEffect(()=>{
    const filename = [ 'not_found_holder.mp4' ]; 
    storage
      .ref( `/${filename}` )
      .getDownloadURL()
      .then( url => {
        setVideoURL(url);
      });
  },[])

  const Video = () => {
    return (
      <video className='webpage-holder' autoPlay loop muted>
          <source src={videoURL} type='video/mp4' />
      </video>
    );
  };
  return (
    <div className='webpage-holder-container'>
        <Video/>
    </div>
  )
}
