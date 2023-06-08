function isUserTurtleNeck(HolisticDetectionResults, windowInfo) {
  const flag = false;
  //   console.log("user is not turtle");
  const height = windowInfo.height;
  const width = windowInfo.width;

  const results = HolisticDetectionResults;
  //   const a = results.faceLandmarks[159].y * height;
  //   const b = results.faceLandmarks[145].y * width;
  //   console.log("위 눈 좌표- 아래 눈 좌표", a - b);
  if (results.faceLandmarks && results.poseLandmarks) {
    //얼굴이 나와야 실행되는 코드
    const chin_y = results.faceLandmarks[152].y * height;
    const left_shoulder_y = results.poseLandmarks[11].y * height;
    const right_shoulder_y = results.poseLandmarks[12].y * height;
    const shoulder_y = (left_shoulder_y + right_shoulder_y) / 2;
    const chin_to_shoulder_length = Math.abs(chin_y - shoulder_y);
    console.log("chin_to_shoulder_length", chin_to_shoulder_length);
  }

  return flag;
}

export { isUserTurtleNeck };
