import React, { useEffect, useRef, useState, useCallback } from "react";
import useRecorder from "./recorder";
// import '../../App.css'
import AWS from 'aws-sdk'
import axios from "axios";
import recordIcon from "../../Logos/png.png"
import submitIcon from "../../Logos/Check 2.png"
import deleteIcon from "../../Logos/X.png"
import stopRecoding from "../../Logos/Group 1.png"
import ReactPlayer from 'react-player'



const TimerController = (props) => {
  const [renderedStreamDuration, setRenderedStreamDuration] = useState(
    "00:00:00"
  ),
    streamDuration = useRef(0),
    previousTime = useRef(0),
    requestAnimationFrameId = useRef(null),
    [isStartTimer, setIsStartTimer] = useState(false),
    [isStopTimer, setIsStopTimer] = useState(false),
    [isPauseTimer, setIsPauseTimer] = useState(false),
    [isResumeTimer, setIsResumeTimer] = useState(false),
    isStartBtnDisabled = isPauseTimer || isResumeTimer || isStartTimer,
    isStopBtnDisabled = !(isPauseTimer || isResumeTimer || isStartTimer);

  const updateTimer = useCallback(() => {
    let now = performance.now();
    let dt = now - previousTime.current;

    if (dt >= 1000) {
      streamDuration.current = streamDuration.current + Math.round(dt / 1000);
      const formattedStreamDuration = new Date(streamDuration.current * 1000)
        .toISOString()
        .substr(11, 8);
      setRenderedStreamDuration(formattedStreamDuration);
      previousTime.current = now;
    }
    requestAnimationFrameId.current = requestAnimationFrame(updateTimer);
  }, []);

  const startTimer = useCallback(() => {
    previousTime.current = performance.now();
    requestAnimationFrameId.current = requestAnimationFrame(updateTimer);
  }, [updateTimer]);

  useEffect(() => {
    if (props.record === true) {
      startHandler();
    } else {
      stopHandler();
    }
    if (isStartTimer && !isStopTimer) {
      startTimer();
    }
    if (isStopTimer && !isStartTimer) {
      streamDuration.current = 0;
      cancelAnimationFrame(requestAnimationFrameId.current);
      setRenderedStreamDuration("00:00:00");
    }
  }, [isStartTimer, isStopTimer, startTimer, props.record]);

  const startHandler = () => {
    setIsStartTimer(true);
    setIsStopTimer(false);
  };

  const stopHandler = () => {
    setIsStopTimer(true);
    setIsStartTimer(false);
    setIsPauseTimer(false);
    setIsResumeTimer(false);
  };

  return (
    <div className="timer-controller-wrapper"
      style={{
        height: '34px',
        width: '34px',
      }}>
      {renderedStreamDuration}s
      <span><img style={{
        height: '100%',
        width: '100%',
        padding: '10px'
      }}
        src={stopRecoding}
      />
      </span>
    </div>
  );
};

function App() {
  const [state, setState] = useState("");
  const [audios, setAudios] = useState([]);
  const [record, setRecord] = useState(false);
  const [showIcons, setShowIcons] = useState(false);
  const [submitAudioToggle, setSubmitAudioToggle] = useState(false);

  let [audioURL, isRecording, startRecording, stopRecording] = useRecorder();
  const windowSize = useRef([window.innerWidth, window.innerHeight]);

  useEffect(() => {
    if (audios.length <= 0) {
      setAudios([audioURL]);
    } else {
      setAudios([...audios, audioURL]);
    }
  }, [audioURL]);

  function Buttonstart() {
    setState("red");
    setRecord(true);
    startRecording();
  }

  async function Buttonstop() {
    if (isRecording === true) {
      await stopRecording();
      setState("#4695da");
      setRecord(false);
      setShowIcons(true);
    }
    else {
    }
  }

  function Deletedata(id) {
    const data = audios.filter((e, index) => {
      return index !== id;
    });
    setAudios(data);
    setShowIcons(false);
  }

  async function submitData(id) {
    setSubmitAudioToggle(true)
    const S3_BUCKET = 'flipbook-tool-data';
    const REGION = 'us-east-2';
    const fileName = `${new Date().getTime()}`;

    AWS.config.update({
      accessKeyId: 'your Key',
      secretAccessKey: 'secret access key'
    })

    const myBucket = new AWS.S3({
      params: { Bucket: S3_BUCKET },
      region: REGION,
    })

    const data = audios.filter((e, index) => {
      return index === id;
    });

    const params = {
      Body: data[0].type.data,
      Bucket: S3_BUCKET,
      Key: fileName,
      ContentType: "audio/webm;codecs=opus"
    };

    const res = await new Promise((resolve, reject) => {
      myBucket.upload(params, (err, data) => err == null ? resolve(data) : console.log(err));
    });

    let audiourl = "http://localhost:2000/api/rm/homev2/storeAudioUrl?CLcode=7&RMcode=7R1&token=7P1&url=";
    let url = audiourl + res.Location
    axios
      .get(url)
      .then((resp) => {
        // alert('Audio submitted')
        setShowIcons(false);
        setSubmitAudioToggle(false)
      })
      .catch((error) => {
        if (error) console.log(error)
      });
  }

  return (
    <div className="recorder-row">
      <div className="main">
        {
          !showIcons ?
            <>
              <div className="column-2">
                <button
                  style={{
                    width: "60px",
                    height: "30px",
                    background: 'none',
                    color: "red",
                    border: 'none',
                    padding: '8px',
                  }}
                  onClick={() => {
                    Buttonstart();
                    setTimeout(() => Buttonstop(), 500);
                  }}
                >
                  {record === true ? (
                    <>
                      <TimerController record={record} />
                    </>
                  ) : (
                    <div className="RecordButton"> <img src={recordIcon} alt="record" /> </div>
                  )}
                </button>
              </div>
            </>
            :
            <>
              <div className="column-1">
                {audios.map((res, index) =>
                  index !== 0
                    ? res && (
                      <div className="audioPlayer">
                        <ReactPlayer
                          width={windowSize.current[0] > 500 ? "400px" : "220px"}
                          height={windowSize.current[0] > 500 ? "50px" : "40px"}
                          playing={false}
                          controls={true}
                          url={res.data}
                        />
                      </div>
                    )
                    : null
                )}
              </div>
              <div className="buttonsSandD">
                {!submitAudioToggle ?
                  <>
                    <div className="column-3">
                      {audios.map((res, index) =>
                        index !== 0
                          ? res && (
                            <>
                              <button
                                style={{
                                  width: "60px",
                                  height: "20px",
                                  background: 'none',
                                  color: "red",
                                  borderRadius: '8px',
                                  border: 'none',
                                  fontFamily: 'Handlee',
                                  fontSize: '30px',
                                  fontWeight: '400',
                                  lineHeight: '40px',
                                  padding: '8px',
                                  // position: 'absolute'
                                }}
                                onClick={() => Deletedata(index)}
                              >
                                <div className="RecordButton">
                                  Delete <img src={deleteIcon} alt="delete" />
                                </div>
                              </button>
                            </>)
                          : null
                      )}
                    </div>
                    <div className="column-4">
                      {audios.map((res, index) =>
                        index !== 0
                          ? res && (
                            <>
                              <button
                                style={{
                                  width: "60px",
                                  height: "20px",
                                  background: "none",
                                  color: "red",
                                  borderRadius: '8px',
                                  border: 'none',
                                  fontFamily: 'Handlee',
                                  fontSize: '30px',
                                  fontWeight: '400',
                                  lineHeight: '40px',
                                  padding: '8px',
                                  position: 'absolute'
                                }}
                                onClick={() => {
                                  submitData(index)
                                }}
                              >
                                <div className="RecordButton"> Submit
                                  <img src={submitIcon} alt="submit" /></div>
                              </button>
                            </>)
                          : null
                      )}
                    </div>
                  </>
                  :
                  <>
                    <div className="column-5">
                      <span className="submitText" style={{ fontFamily: 'Handlee', 'color': 'red', 'fontSize': '30px', 'fontWeight': '400', 'lineHeight': '40px', }}>Audio Submitted</span>
                      <div className="AudiSubmitImage">
                        <img src={submitIcon} alt="submit" />
                      </div>
                    </div>
                  </>
                }
              </div>
            </>
        }

      </div>
    </div >
  );
}
export default App;