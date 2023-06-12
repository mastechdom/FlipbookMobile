import HTMLFlipBook from 'react-pageflip';
import './MobileFlipbook.css';
import img1 from '../Images/1.jpg';
import img2 from '../Images/2.jpg';
import img3 from '../Images/3.jpg';
import img4 from '../Images/4.png';
import AudioPlayer from './AudioPlayer';
import AudioRecorder from './AudioRecorder/index';

function MyBook(props) {


    return (
        <HTMLFlipBook
            width={400}
            height={600}
            maxShadowOpacity={0.5}
            drawShadow={true}
            flippingTime={2000}
        >
            <div className="demoPage">

                <img src={img1} alt='pic'></img>
            </div>
            <div className="demoPage">
                <div className="AudioPlayer">
                    <div>
                        <AudioPlayer />
                    </div>
                </div>
                <div className="Image">
                    <img src={img2} alt='pic' />
                </div>
            </div>
            <div className="demoPage">
                <img src={img3} alt='pic'></img>
            </div>
            <div className="demoPage">
                <div className="AudioRecorder">
                    <div>
                        <AudioRecorder />
                    </div>
                </div>
                <div className="Image">
                    <img src={img4} alt='pic'></img>
                </div>

            </div>
        </HTMLFlipBook>
    );
}
export default MyBook;
