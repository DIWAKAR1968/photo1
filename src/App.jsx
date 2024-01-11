import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import image from "./images/right-img.png";
import frame from "./images/frame-3.png";

function App() {
  const [imgSrc, setImgSrc] = useState(null);
  const [isPortrait, setIsPortrait] = useState(window.matchMedia("(orientation: portrait)").matches);
  const webcamRef = useRef(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log("clicked");
    setImgSrc(imageSrc);
  };

  const retake = () => {
    setImgSrc(null);
  };

  const captureScreen = () => {
    if (imgSrc) {
      const frameElement = document.querySelector(".frame_image_container");
      const frameImage = document.querySelector(".frame_image");

      if (frameElement && frameImage) {
        const frameRect = frameElement.getBoundingClientRect();
        const frameImageRect = frameImage.getBoundingClientRect();

        const offsetX = frameImageRect.left - frameRect.left;
        const offsetY = frameImageRect.top - frameRect.top;

        html2canvas(frameElement, {
          backgroundColor: null,
          width: frameImageRect.width,
          height: frameImageRect.height,
          x: offsetX,
          y: offsetY,
        }).then(async (canvas) => {
          const screenshot = canvas.toDataURL();
          const base64Response = await fetch(screenshot);
          const blob = await base64Response.blob();

          saveAs(blob, "photo.png");
        });
      }
    } else {
      alert("Please Capture a Photo First");
    }
  };

  const width = window.innerWidth;

  const videoConstraints = {
    width: width <= 667 ? 178 : width < 900 ? 180 : 350,
    height: width <= 667 ? 185 : width < 900 ? 220 : 352,
    facingMode: "user",
  };


  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
  
    window.addEventListener('resize', handleResize);
  
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      {isPortrait ? (
        <div className="portrait-mode">
          <h2>Please rotate your device</h2>
        </div>
      ) : (
        <div className="main_container">
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
          <div className="line4"></div>
          <div className="button_container">
            <button className="but1" onClick={capture}>
              CAPTURE
            </button>
            <button className="but2">POST</button>
            <button className="but3" onClick={retake}>
              RETAKE
            </button>
            <button className="but4" onClick={captureScreen}>
              SAVE
            </button>
          </div>

          <div className="frame_image_container">
            <img className="frame_image" src={frame} />
            <div className="camera_image">
              {imgSrc ? (
                <img src={imgSrc} />
              ) : (
                <div className="frame">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="webcam"
                    videoConstraints={videoConstraints}
                  />
                </div>
              )}
            </div>
          </div>

          <img className="right" src={image} />
        </div>
      )}
    </div>
  );
}

export default App;
