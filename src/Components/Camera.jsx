import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
const videoConstraints = {
    width: 250,
    height: 250,
    facingMode: 'environment'
}
const Camera = () => {
    const webcamRef = useRef(null)

    const [url, setUrl] = useState(null)

    const capturePhoto = React.useCallback(async () => {
        const imageSrc = webcamRef.current.getScreenshot()
        console.log(imageSrc);
        setUrl(imageSrc)
    }, [webcamRef])

    const onUserMedia = (e) => {
        console.log(e)
    }
    return (
        <div>
            <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/png"
                videoConstraints={videoConstraints}
                onUserMedia={onUserMedia}
                mirrored={true}
                screenshotQuality={1}
            />
            <br /><br />
            <button onClick={capturePhoto}>Capture</button>
            <button onClick={() => setUrl(null)}>Refresh</button>

            {url && (
                <div>
                    <img src={url} alt="Screenshot" />
                </div>
            )}
        </div>
    )
}
export default Camera;