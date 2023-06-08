import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as holistic from "@mediapipe/holistic";

const HolisticFaceDetection = () => {
  const [loaded, setLoaded] = useState(false);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const holisticRef = useRef(null);

  useEffect(() => {
    const runHolistic = async () => {
      await console.log("hello333");
      // 비디오 요소와 캔버스 요소를 가져옵니다.
      const webcamElement = webcamRef.current.video;
      const canvasElement = canvasRef.current;

      // Holistic 모델을 로드합니다.
      const holisticModel = new holistic.Holistic({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
      });
      holisticModel.setOptions({
        static_image_mode: false,
        upperBodyOnly: false,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      await holisticModel.onResults(onHolisticResults);
      await console.log("hello2");

      function onHolisticResults(results) {
        // 얼굴 감지 결과를 받아옵니다.
        const faces = results.detections;
        console.log(faces);
        // 캔버스에 얼굴 경계 상자를 그립니다.
        const canvasContext = canvasElement.getContext("2d");
        canvasContext.clearRect(
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
        faces.forEach((face) => {
          const boundingBox = face.boundingBox;
          canvasContext.strokeStyle = "#00FF00";
          canvasContext.lineWidth = 2;
          canvasContext.strokeRect(
            boundingBox.origin.x * canvasElement.width,
            boundingBox.origin.y * canvasElement.height,
            boundingBox.width * canvasElement.width,
            boundingBox.height * canvasElement.height
          );
        });
      }

      // Holistic 추적을 시작합니다.
      const videoWidth = webcamElement.videoWidth;
      const videoHeight = webcamElement.videoHeight;
      webcamElement.width = videoWidth;
      webcamElement.height = videoHeight;
      canvasElement.width = videoWidth;
      canvasElement.height = videoHeight;

      holisticModel.reset();
      // holisticModel.send({ image: webcamElement });
    };

    runHolistic();
  }, []);

  const handleVideoLoad = (videoNode) => {
    setLoaded(true); // react-webcam이 loaded 되었다고 state를 변경함.
  };

  return (
    <div>
      <Webcam ref={webcamRef} mirrored={true} />
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0 }}
        onLoadedData={handleVideoLoad}
      />
    </div>
  );
};

export default HolisticFaceDetection;
