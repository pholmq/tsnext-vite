import React, { useRef, useState, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { FaPlay, FaPause, FaSave } from "react-icons/fa";
import { Vector3, Quaternion } from "three";
import { useStore } from "../store";

// Interface for camera recording data
interface CameraData {
  timestamp: number;
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  quaternion: { x: number; y: number; z: number; w: number }; // Quaternion to store the camera's orientation
}

interface RecordingData {
  id: string;
  start: string;
  end: string;
  frames: CameraData[];
}

// Utility to generate unique IDs
const generateID = () => "_" + Math.random().toString(36).substr(2, 9);

const CameraRecorder = () => {
  const cameraTarget = useStore((s) => s.cameraTarget);
  const cameraFollow = useStore((s) => s.cameraFollow);
  const { scene } = useThree();
  const cameraControlsRef = useRef<CameraControls>(null);
  const targetObjRef = useRef<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingData, setRecordingData] = useState<RecordingData | null>(null);
  const [recordingsList, setRecordingsList] = useState<RecordingData[]>([]);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const target = new Vector3();

  // Set camera target to follow the target object
  useEffect(() => {
    targetObjRef.current = scene.getObjectByName(cameraTarget);
    targetObjRef.current?.getWorldPosition(target);
    cameraControlsRef.current?.setTarget(target.x, target.y, target.z, false);
  }, [cameraTarget, scene]);

  useFrame(() => {
    if (cameraFollow) {
      targetObjRef.current?.getWorldPosition(target);
      cameraControlsRef.current?.setTarget(target.x, target.y, target.z, false);
    }

    if (isRecording) {
      recordFrame();
    }
  });

  // Function to record the camera's current position, target, and orientation (quaternion)
  const recordFrame = () => {
    const timestamp = Date.now();
    const cameraPosition = cameraControlsRef.current?.camera.position;
    const cameraTarget = cameraControlsRef.current?.getTarget();
    const cameraQuaternion = cameraControlsRef.current?.camera.quaternion; // Get the camera's quaternion (orientation)

    if (cameraPosition && cameraTarget && cameraQuaternion) {
      setRecordingData((prev) =>
        prev
          ? {
              ...prev,
              frames: [
                ...prev.frames,
                {
                  timestamp,
                  position: {
                    x: cameraPosition.x,
                    y: cameraPosition.y,
                    z: cameraPosition.z,
                  },
                  target: {
                    x: cameraTarget.x,
                    y: cameraTarget.y,
                    z: cameraTarget.z,
                  },
                  quaternion: {
                    x: cameraQuaternion.x,
                    y: cameraQuaternion.y,
                    z: cameraQuaternion.z,
                    w: cameraQuaternion.w,
                  },
                },
              ],
            }
          : prev
      );
    }
  };

  const startRecording = () => {
    const start = new Date().toISOString();
    setRecordingData({ id: generateID(), start, end: "", frames: [] });
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (!recordingData) return;

    const end = new Date().toISOString();
    const completedRecording = { ...recordingData, end };
    setIsRecording(false);
    setRecordingsList((prev) => [...prev, completedRecording]);
  };

  const playRecording = (recording: RecordingData) => {
    if (recording.frames.length === 0) return;

    let index = 0;
    setIsPlaying(true);

    playbackIntervalRef.current = setInterval(() => {
      if (index < recording.frames.length) {
        const { position, target, quaternion } = recording.frames[index];
        // Set both the camera's position, target, and orientation (quaternion)
        cameraControlsRef.current?.camera.position.set(position.x, position.y, position.z);
        cameraControlsRef.current?.setLookAt(position.x, position.y, position.z, target.x, target.y, target.z, false);

        // Apply the quaternion to set the orientation of the camera
        const camQuaternion = new Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
        cameraControlsRef.current?.camera.quaternion.copy(camQuaternion);

        index++;
      } else {
        clearInterval(playbackIntervalRef.current as NodeJS.Timeout);
        setIsPlaying(false);
      }
    }, 1000 / 60); // Play at 60 FPS
  };

  const saveRecordingAsJSON = (recording: RecordingData) => {
    const json = JSON.stringify(recording, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `recording_${recording.start}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, []);

  return (
    <>
      <CameraControls ref={cameraControlsRef} maxDistance={500000} />

      {/* Recording & Playback UI */}
      <div className="absolute top-4 left-4 z-10 p-4 bg-gray-900 bg-opacity-80 rounded-md">
        <button
          className="bg-gray-700 text-white rounded px-4 py-2 mb-2"
          onClick={startRecording}
          disabled={isRecording}
        >
          <FaPlay className="inline mr-2" />
          Start Recording
        </button>
        <button
          className="bg-gray-700 text-white rounded px-4 py-2 mb-2"
          onClick={stopRecording}
          disabled={!isRecording}
        >
          <FaPause className="inline mr-2" />
          Stop Recording
        </button>

        {/* List of Recordings */}
        {recordingsList.length > 0 && (
          <div className="mt-4">
            <h2 className="text-white mb-2">Saved Recordings:</h2>
            <ul>
              {recordingsList.map((recording) => (
                <li key={recording.id} className="text-white mb-2">
                  <span>{`Recording from ${recording.start} to ${recording.end}`}</span>
                  <button
                    className="bg-gray-700 text-white rounded px-4 py-2 ml-2"
                    onClick={() => playRecording(recording)}
                    disabled={isPlaying}
                  >
                    <FaPlay className="inline mr-2" />
                    Play
                  </button>
                  <button
                    className="bg-blue-700 text-white rounded px-4 py-2 ml-2"
                    onClick={() => saveRecordingAsJSON(recording)}
                  >
                    <FaSave className="inline mr-2" />
                    Save as JSON
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default CameraRecorder;
