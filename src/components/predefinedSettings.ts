export type PredefinedSettingsKey = "chapter5_2" | "chapter5_3" | "chapter5_4";

export const predefinedSettings: Record<PredefinedSettingsKey, any> = {
  chapter5_2: {
    cameraTarget: "Mars",
    traceDots: true,
    traceLength: 5000,
    orbits: true,
    cameraPosition: { x: 1000, y: 500, z: 1000 },
    zoom: 1,
    date: "2024-10-11",
    time: "12:00",
  },
  chapter5_3: {
    cameraTarget: "Earth",
    traceDots: false,
    traceLength: 1000,
    orbits: true,
    cameraPosition: { x: 1500, y: 800, z: 1500 },
    zoom: 1.2,
    date: "2024-10-11",
    time: "15:00",
  },
  chapter5_4: {
    cameraTarget: "Mars",
    traceDots: true,
    traceLength: 8000,
    orbits: true,
    cameraPosition: { x: 2000, y: 1000, z: 2000 },
    zoom: 1.5,
    date: "2024-10-11",
    time: "18:00",
  },
};
