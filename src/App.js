import './App.css';
import React, {useEffect, useRef, useState} from 'react'
import ReactPlayer from 'react-player'
import screenful from "screenfull";
import Controls from "./components/Controls";
import Container from "@material-ui/core/Container";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles((theme) => ({
  playerWrapper: {
    width: "100%",

    position: "relative",
    // "&:hover": {
    //   "& $controlsWrapper": {
    //     visibility: "visible",
    //   },
    // },
  },

  controlsWrapper: {
    visibility: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  topControls: {
    display: "flex",
    justifyContent: "flex-end",
    padding: theme.spacing(2),
  },
  middleControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomWrapper: {
    display: "flex",
    flexDirection: "column",

    // background: "rgba(0,0,0,0.6)",
    // height: 60,
    padding: theme.spacing(2),
  },

  bottomControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    // height:40,
  },

  button: {
    margin: theme.spacing(1),
  },
  controlIcons: {
    color: "#777",

    fontSize: 50,
    transform: "scale(0.9)",
    "&:hover": {
      color: "#fff",
      transform: "scale(1)",
    },
  },

  bottomIcons: {
    color: "#999",
    "&:hover": {
      color: "#fff",
    },
  },

  volumeSlider: {
    width: 100,
  },
}));

function App() {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [prePosition, setPrePosition] = useState(null);
  const [currentSlidePosition, setCurrentSlidePosition] = useState(null);
  const [currentSlideList, setCurrentSlideList] = useState([]);
  const [content, setContent] = useState([]);
  const [url, setUrl] = useState(null);
  const [isShow, setIsShow] = useState(false);
  const player = useRef(null);
  const [width, setWidth] = useState(1024)
  const TYPE_SEEK = 1;
  const TYPE_NEXT_VIDEO = 2;
  const TYPE_SLIDE_VIDEO = 3;
  const TYPE_NEXT_SLIDE = 4;
  const TYPE_PREV_SLIDE = 5;
  const playerContainerRef = useRef(null);
  const controlsRef = useRef(null);
  const canvasRef = useRef(null);
  const classes = useStyles();
  let count = 0;
  const [state, setState] = useState({
    pip: false,
    playing: false,
    controls: false,
    light: false,
    muted: false,
    played: 0,
    duration: 0,
    playbackRate: 1.0,
    volume: 1,
    loop: false,
    seeking: false,
  });
  const format = (seconds) => {
    if (isNaN(seconds)) {
      return `00:00`;
    }
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
  };
  const [timeDisplayFormat, setTimeDisplayFormat] = React.useState("normal");
  const handlePlayPause = () => {
    setState({...state, playing: !state.playing});
  };

  const handleRewind = () => {
    player.current.seekTo(player.current.getCurrentTime() - 10);
  };

  const handleFastForward = () => {
    player.current.seekTo(player.current.getCurrentTime() + 10);
  };

  // const handleProgress = (changeState) => {
  //   if (count > 3) {
  //     controlsRef.current.style.visibility = "hidden";
  //     count = 0;
  //   }
  //   if (controlsRef.current.style.visibility == "visible") {
  //     count += 1;
  //   }
  //   if (!state.seeking) {
  //     setState({ ...state, ...changeState });
  //   }
  // };

  const handleSeekChange = (e, newValue) => {
    setState({...state, played: parseFloat(newValue / 100)});
  };

  const handleSeekMouseDown = (e) => {
    setState({...state, seeking: true});
  };

  const handleSeekMouseUp = (e, newValue) => {
    console.log({value: e.target});
    setState({...state, seeking: false});
    // console.log(sliderRef.current.value)
    player.current.seekTo(newValue / 100, "fraction");
  };

  const handleDuration = (duration) => {
    setState({...state, duration});
  };

  const handleVolumeSeekDown = (e, newValue) => {
    setState({...state, seeking: false, volume: parseFloat(newValue / 100)});
  };
  const handleVolumeChange = (e, newValue) => {
    // console.log(newValue);
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
  };

  const toggleFullScreen = () => {
    screenful.toggle(playerContainerRef.current);
  };

  const handleMouseMove = () => {
    controlsRef.current.style.visibility = "visible";
    count = 0;
  };

  const hanldeMouseLeave = () => {
    controlsRef.current.style.visibility = "hidden";
    count = 0;
  };

  const handleDisplayFormat = () => {
    setTimeDisplayFormat(
      timeDisplayFormat == "normal" ? "remaining" : "normal"
    );
  };

  const handlePlaybackRate = (rate) => {
    setState({...state, playbackRate: rate});
  };

  const hanldeMute = () => {
    setState({...state, muted: !state.muted});
  };

  function handleResize() {
    setWidth(window.innerWidth);
  }

  const playData = [
    {
      id: 1,
      type: TYPE_NEXT_VIDEO,
      time_show: 1,
      url: "video1.mp4",
      // duration:5,
      banners: [2, 3],
      pre_position: null
    },
    {
      id: 2,
      type: TYPE_NEXT_VIDEO,
      url: "climbhill.mp4",
      text: "Climb Hill",
      banners: [6, 7],
      time_show: 3,
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        left: "15%",
        top: "40%",
        background: "white",
        width: "30%",
        height: "25%",
        fontSize: "1rem",
        borderRadius: "10px",
        opacity: 0.8,
        cursor: "pointer"
      },

      pre_position: 1,
    },
    {
      id: 3,
      type: TYPE_NEXT_VIDEO,
      text: "Swimming",
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        right: "15%",
        top: "40%",
        background: "white",
        width: "30%",
        height: "25%",
        fontSize: "1rem",
        borderRadius: "10px",
        opacity: 0.8,
        cursor: "pointer"
      },
      url: "swimming.mp4",
      pre_position: 1,
      banners: [4, 5],
      time_show: 5,
    },
    {
      id: 4,
      type: TYPE_NEXT_VIDEO,
      text: "Go Racing",
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        left: "15%",
        top: "40%",
        background: "white",
        width: "30%",
        height: "25%",
        fontSize: "1rem",
        borderRadius: "10px",
        opacity: 0.8,
        cursor: "pointer"
      },
      url: "racing.mp4",
      pre_position: 3,
    },
    {
      id: 5,
      type: TYPE_NEXT_VIDEO,
      text: "Go Home",
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        right: "15%",
        top: "40%",
        background: "white",
        width: "30%",
        height: "25%",
        fontSize: "1rem",
        borderRadius: "10px",
        opacity: 0.8,
        cursor: "pointer"
      },
      url: "gohome.mp4",
      pre_position: 3,
    },
    {
      id: 6,
      type: TYPE_NEXT_VIDEO,
      text: "Look Around",
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        left: "15%",
        top: "40%",
        background: "white",
        width: "30%",
        height: "25%",
        fontSize: "1rem",
        borderRadius: "10px",
        opacity: 0.8,
        cursor: "pointer"
      },
      url: "lookaround.mp4",
      pre_position: 2,
    },
    {
      id: 7,
      type: TYPE_SLIDE_VIDEO,
      slides: [
        {name: 'slide 1', time: 15},
        {name: 'slide 2', time: 30},
        {name: 'slide 2', time: 45},
      ],
      text: "Look Sky",
      banners: [8, 9],
      time_show: 1,
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        right: "15%",
        top: "40%",
        background: "white",
        width: "30%",
        height: "25%",
        fontSize: "1rem",
        borderRadius: "10px",
        opacity: 0.8,
        cursor: "pointer"
      },
      url: "sky.mp4",
      pre_position: 2,
    },
    {
      id: 8,
      type: TYPE_NEXT_SLIDE,
      text: "Next Slide",
      seek_to: 16,
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        left: "60%",
        bottom: "30%",
        background: "white",
        width: "20%",
        height: "10%",
        fontSize: "1rem",
        borderRadius: "10px",
        opacity: 0.8,
        cursor: "pointer"
      },
      pre_position: 7,
    },
    {
      id: 9,
      type: TYPE_SEEK,
      text: "Back slide",
      seek_to: 0,
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        bottom: "30%",
        left: "25%",
        background: "white",
        width: "20%",
        height: "10%",
        fontSize: "1rem",
        borderRadius: "10px",
        opacity: 0.8,
        cursor: "pointer"
      },
      pre_position: 7,
    },
  ];
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    setUrl(playData[currentPosition].url)
  }, []);
  const handleProgress = (changState) => {
    if (typeof playData[currentPosition] !== 'undefined') {
      if (playData[currentPosition].hasOwnProperty('duration')) {
        if (changState.playedSeconds > playData[currentPosition].time_show && changState.playedSeconds < (playData[currentPosition].time_show + playData[currentPosition].duration)) {
          setIsShow(true)
        } else {
          setIsShow(false)
        }
      } else {
        if (changState.playedSeconds > playData[currentPosition].time_show) {
          setIsShow(true)
        } else {
          setIsShow(false)
        }
      }
    }



    setState({...state, ...changState});
  }
  useEffect(() => {
    if(currentSlideList.length > 0) {
      player.current.seekTo(currentSlideList[currentSlidePosition-1].time);
    }
  }, [currentSlidePosition]);


  useEffect(()=>{
    if(currentSlideList.length >0) {
      playData[currentPosition].banners.forEach((index) => {
        let item = playData[index - 1];
        if (item.type === TYPE_NEXT_SLIDE) {
          setContent(content => [...content, (<div key={item.id} style={item.style} onClick={(e) => {
            // console.log(currentSlideList);
            // console.log(currentSlidePosition);
            // player.current.seekTo(currentSlideList[currentSlidePosition].time);
            setCurrentSlidePosition(currentSlidePosition=>currentSlidePosition + 1);
          }}>{item.text}</div>)])
        } else {
          setContent(content => [...content, (<div key={item.id} style={item.style} onClick={(e) => {
            setUrl(item.url);
            setIsShow(false);
            setContent([]);
            setPrePosition(item.pre_position - 1);
            setCurrentPosition(item.id - 1);
          }}>{item.text}</div>)])
        }
      });
    }
  }, [currentSlideList]);
  useEffect(() => {
    if (isShow) {
      if (playData[currentPosition].type === TYPE_SLIDE_VIDEO) {

        setCurrentSlideList(playData[currentPosition].slides);
      } else {
        console.log("render nomarl");
        playData[currentPosition].banners.forEach((index) => {
          let item = playData[index - 1];
          if (item.type === TYPE_SEEK) {
            setContent(content => [...content, (<div key={item.id} style={item.style} onClick={(e) => {
              player.current.seekTo(item.seek_to);
            }}>{item.text}</div>)])
          } else {
            setContent(content => [...content, (<div key={item.id} style={item.style} onClick={(e) => {
              setUrl(item.url);
              setIsShow(false);
              setContent([]);
              setPrePosition(item.pre_position - 1);
              setCurrentPosition(item.id - 1);
            }}>{item.text}</div>)])
          }
        });
      }

    }

  }, [isShow]);
  const {
    playing,
    controls,
    light,
    muted,
    loop,
    playbackRate,
    pip,
    played,
    seeking,
    volume,
  } = state;
  const currentTime =
    player && player.current
      ? player.current.getCurrentTime()
      : "00:00";

  const duration =
    player && player.current ? player.current.getDuration() : "00:00";
  const elapsedTime =
    timeDisplayFormat == "normal"
      ? format(currentTime)
      : `-${format(duration - currentTime)}`;

  const totalDuration = format(duration);
  return (
    <Container maxWidth="lg">
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={hanldeMouseLeave}
        ref={playerContainerRef}
        className={classes.playerWrapper}
      >
        <ReactPlayer
          ref={player}
          url={url}
          playsinline
          playing={playing}
          style={{
            position: 'relative', bacgroundSize: "cover",
            objectFit: "contain"
          }}
          className="react-player"
          progressInterval={100}
          width="100%"
          height="100%"
          playbackRate={playbackRate}
          onProgress={handleProgress}
        />
        <Controls
          ref={controlsRef}
          onSeek={handleSeekChange}
          onSeekMouseDown={handleSeekMouseDown}
          onSeekMouseUp={handleSeekMouseUp}
          onDuration={handleDuration}
          onRewind={handleRewind}
          onPlayPause={handlePlayPause}
          onFastForward={handleFastForward}
          playing={playing}
          played={played}
          elapsedTime={elapsedTime}
          totalDuration={totalDuration}
          onMute={hanldeMute}
          muted={muted}
          onVolumeChange={handleVolumeChange}
          onVolumeSeekDown={handleVolumeSeekDown}
          onChangeDispayFormat={handleDisplayFormat}
          playbackRate={playbackRate}
          onPlaybackRateChange={handlePlaybackRate}
          onToggleFullScreen={toggleFullScreen}
          volume={volume}
        />
        {prePosition != null && <div onClick={() => {
          setUrl(playData[0].url);
          setCurrentPosition(0);
          setPrePosition(null);
          setContent([]);
        }}
                                     style={{
                                       cursor: 'pointer',
                                       position: "absolute",
                                       top: 10,
                                       background: 'Blue',
                                       padding: 10,
                                       borderRadius: 10,
                                       left: 10,
                                       color: "white",
                                       fontSize: "calc(1vw + 1vh)"
                                     }}>
          Home
        </div>}
        {prePosition != null && <div onClick={() => {
          setUrl(playData[prePosition].url);
          if (playData[prePosition].id - 1 >= 0) {
            setCurrentPosition(playData[prePosition].id - 1);
          }
          if (playData[prePosition].pre_position != null) {
            setPrePosition(playData[prePosition].pre_position - 1);
          } else {
            setPrePosition(null);
          }
          setContent([]);
        }}
                                     style={{
                                       cursor: 'pointer',
                                       position: "absolute",
                                       top: 65,
                                       background: 'green',
                                       padding: 10,
                                       borderRadius: 10,
                                       left: 10,
                                       color: "white",
                                       fontSize: "calc(1vw + 1vh)"
                                     }}>
          Back to previous action
        </div>}
        {content}

      </div>
    </Container>
  );
}

export default App;
