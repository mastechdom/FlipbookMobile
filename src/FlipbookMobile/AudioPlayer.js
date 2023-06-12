import React from 'react'
import ReactPlayer from 'react-player'
import AudioVoice from '../Audios/A33.mp3'
import './MobileFlipbook.css'

const Audio = () => {

  return (
    <div className="audioPlayer">
      <ReactPlayer
        width={250}
        height={40}
        playing={false}
        controls={true}
        url={AudioVoice}
      />
    </div>
  );
}


export default Audio;