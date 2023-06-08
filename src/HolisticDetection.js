import { React, useEffect, useRef } from "react";

import Webcam from "react-webcam";
import { Holistic } from "@mediapipe/holistic";
import * as cam from "@mediapipe/camera_utils";
import * as HolisticLib from "@mediapipe/holistic";
// 다른 함수들 import
import { isUserTurtleNeck } from "./DetectTurtle";

function turtleDetection(
  HolisticDetectionResults,
  { width: videoWidth, height: videoHeight }
) {
  const height = videoHeight;
  const width = videoWidth;

  const results = HolisticDetectionResults;
  var chin_to_shoulder_length = null;
  if (results.faceLandmarks && results.poseLandmarks) {
    //얼굴이 나와야 실행되는 코드
    const chin_y = results.faceLandmarks[152].y * height;
    const left_shoulder_y = results.poseLandmarks[11].y * height;
    const right_shoulder_y = results.poseLandmarks[12].y * height;
    const shoulder_y = (left_shoulder_y + right_shoulder_y) / 2;
    chin_to_shoulder_length = Math.abs(chin_y - shoulder_y);
    console.log("chin_to_shoulder_length", chin_to_shoulder_length);
  } else {
    console.log("no face & shoulder");
  }

  return chin_to_shoulder_length;
}

function HolisticDetection() {
  const webcamRef = useRef(null);
  var camera = null;
  var goodLengthList = [];
  var isTurtleDetected = false;
  const audio = new Audio("/sound/sound_ex.wav");

  function onResultsHolistic(results) {
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // isUserTurtleNeck(results, { width: videoWidth, height: videoHeight });
    if (isTurtleDetected == false) {
      const v = turtleDetection(results, {
        width: videoWidth,
        height: videoHeight,
      });
      if (v != -1) {
        goodLengthList.push(v);
        console.log("값 넣음", goodLengthList.length);
      }
      if (goodLengthList.length >= 60) {
        // goodLengthList 정리
        console.log("60!");
        goodLengthList = goodLengthList.slice(10);
        isTurtleDetected = true;
      }
    } else {
      // console.log("now.. just run");
      const v = turtleDetection(results, {
        width: videoWidth,
        height: videoHeight,
      });

      let sum = goodLengthList.reduce(
        (acc, currentValue) => acc + currentValue,
        0
      );
      let average = sum / goodLengthList.length;

      if (v < average * 0.93) {
        console.log("거북목입니당");
        audio.play();
      } else {
        console.log("측정시작");
        audio.pause();
      }
    }

    // todo: canvas 그리기
  }

  useEffect(() => {
    const holisticModel = new Holistic({
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

    holisticModel.onResults(onResultsHolistic);

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await holisticModel.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);

  return (
    <div>
      <Webcam ref={webcamRef} />
    </div>
  );
}

export default HolisticDetection;
