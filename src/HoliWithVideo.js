import { React, useEffect, useRef } from "react";

import Webcam from "react-webcam";
import { Holistic } from "@mediapipe/holistic";
import * as cam from "@mediapipe/camera_utils";
import * as HolisticLib from "@mediapipe/holistic";
// 다른 함수들 import
import { isUserTurtleNeck } from "./DetectTurtle";

function HoliWithVideo() {
  const videoRef = useRef(null);
  var camera = null;

  async function onResultsHolistic(results) {
    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;
    console.log("v w ", videoWidth);

    await isUserTurtleNeck(results, { width: videoWidth, height: videoHeight });
    // todo: canvas 그리기
  }

  useEffect(async () => {
    const holisticModel = await new Holistic({
      locateFile: (file) => {
        console.log(file);

        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      },
    });

    holisticModel.setOptions({
      upperBodyOnly: false,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    await holisticModel.send({ image: videoRef.current });
    await holisticModel.onResults(onResultsHolistic);

    if (videoRef.current) {
      const video = videoRef.current;

      const camera = new cam.Camera(video, {
        onFrame: async () => {
          await holisticModel.send({ image: video });
        },
        width: video.width,
        height: video.height,
      });
      camera.start();
    }
  }, []);

  return (
    <div>
      <video ref={videoRef} controls width={600} autoPlay muted>
        <source src="/video/human_face_video.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

export default HoliWithVideo;
