import React, { useRef, useEffect } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import { drawMesh } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });
    setInterval(() => {
      detect(net);
    }, 100); // Slightly longer interval for performance
  };

  const detect = async (net) => {
    if (
      webcamRef.current &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const face = await net.estimateFaces(video);
      console.log(face);

      const ctx = canvasRef.current.getContext("2d");
      requestAnimationFrame(() => drawMesh(face, ctx));
    }
  };

  useEffect(() => {
    runFacemesh();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Face Detection App</h1>
        <p>Real-time facial detection using TensorFlow.js and FaceMesh.</p>
      </header>

      <main className="app-main">
        <div className="detection-area">
          <Webcam
            ref={webcamRef}
            className="webcam"
          />
          <canvas
            ref={canvasRef}
            className="canvas"
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>Powered by TensorFlow.js & React</p>
      </footer>
    </div>
  );
}

export default App;
