import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";

gsap.registerPlugin(ScrollTrigger);

const VideoCarousel = () => {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);
  const controlWrapperRef = useRef(null);

  const [loadedData, setLoadedData] = useState([]);
  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false
  });

  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;

  const handleProcess = (type, index) => {
    switch (type) {
      case "video-end":
        setVideo((prevVideo) => ({ ...prevVideo, isEnd: true, videoId: index + 1 }))
        break;
      case "video-last":
        setVideo((prevVideo) => ({ ...prevVideo, isLastVideo: true }))
        break;
      case "video-reset":
        setVideo((prevVideo) => ({ ...prevVideo, isLastVideo: false, videoId: 0 }))
        break;
      case "play":  
      case "pause":
        setVideo(prevVideo => ({ ...prevVideo, isPlaying: !prevVideo.isPlaying  }));
        break;
      default:
        return video;
    }
  }; 

  const handleLoadedMetadata = (index, event) => 
    setLoadedData(prevData => [...prevData, event]);

  useGSAP(() => {
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: 'power2.inOut'
    });

    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none"
      },
      onComplete: () => {
        setVideo((prev) => ({
          ...prev,
          startPlay: true,
          isPlaying: true
        }));
      }
    });
  }, [isEnd, videoId]);

  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if (span[videoId]) {
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);

          if(progress != currentProgress) {
            currentProgress = progress;

            gsap.to(videoDivRef.current[videoId], {
              width: window.innerWidth < 760
                ? "10vw"
                : window.innerWidth < 1200
                  ? "10vw"
                  : "4vw"
            });

            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white"
            })
          }
        },
        onComplete: () => {
          if(isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px"
            })
            gsap.to(span[videoId], {
              backgroundColor: "#AFAFAF"
            });
          }
        }
      });

      if(videoId === 0) {
        anim.restart();
      }

      const animUpdate = () => {
        const currentVideo = videoRef.current[videoId];
        if (currentVideo && videoId !== 0) {
          anim.progress(currentVideo.currentTime / hightlightsSlides[videoId].videoDuration);
        }
      };

      if(isPlaying) {
        gsap.ticker.add(animUpdate);
      } else {
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, startPlay, isPlaying]);

  useEffect(() => {
    if (window.innerWidth >= 760) {
      gsap.to(controlWrapperRef.current, {
        y: 0,
        opacity: 1,
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 25,
        scrollTrigger: {
          trigger: "#highlights",
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onLeave: () => {
            gsap.to(controlWrapperRef.current, {
              opacity: 0,
            });
          }
        },
      });
    } else {
      gsap.to(controlWrapperRef.current, {
        y: 0,
        opacity: 1,
      });
    }
  }, []);

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, index) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline={true}
                  preload="auto"
                  muted
                  className={`${ 
                    list.id === 2 && 'translate-x-44'}
                    pointer-event-none
                  `}
                  ref={(el) => (videoRef.current[index] = el)}
                  onEnded={() => {
                    index !== 3 
                      ? handleProcess("video-end", index)
                      : handleProcess("video-last")
                  }}
                  onPlay={() => {
                    setVideo(prevVideo => ({
                      ...prevVideo,
                      isPlaying: true
                    }));
                  }}
                  onLoadedMetadata={(event) => 
                    handleLoadedMetadata(index, event)
                  }
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text) => (
                  <p key={text} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div ref={controlWrapperRef} className="flex flex-center justify-center mt-10 opacity-0">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              ref={(el => (videoDivRef.current[i] = el))}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el => (videoSpanRef.current[i] = el))}
              ></span>
            </span>
          ))}
        </div>

        <button 
          className="control-btn"
          onClick={isLastVideo ?
            () => handleProcess("video-reset")
            : !isPlaying
              ? () => handleProcess("play")
              : () => handleProcess("pause")
          }
        >
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            />
        </button>
      </div>
    </>
  )
}

export default VideoCarousel;