import { useState, useRef } from 'react';

import MobilView from './FlipbookMobile/index'

function App() {

  // const[screenSize, setScreenSize] = useState(null);
  const windowWidth = useRef(window.innerWidth);
  const windowHeight = useRef(window.innerHeight);
  console.log('width: ', windowWidth.current);
  console.log('height: ', windowWidth.current);

  return (
    <div className="App">
      {windowWidth.current > 800 ?
        <>
          Azhar
        </>
        :
        <MobilView />
      }
    </div>
  );
}

export default App;
