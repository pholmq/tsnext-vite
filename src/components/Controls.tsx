import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useStore, useTraceStore } from "../store";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaBars,
  FaTimes,
  FaPlus,
  FaMinus,
  FaInfo,
} from "react-icons/fa";
import {
  posToDate,
  posToTime,
  posToJulianDay,
  isValidDate,
  dateTimeToPos,
  dateToDays,
  addYears,
  addMonths,
  timeToPos,
  isValidTime,
  isNumeric,
  julianDayTimeToPos,
  speedFactOpts,
  speedFactOptions,
  sDay,
  sMonth,
  sYear,
} from "../utils/time-date-functions";
import { PerformanceMonitor, Stats } from "@react-three/drei";
import { Leva, button, buttonGroup, folder, useControls } from "leva";
import { getAllPositions } from "../utils/celestial-functions";

function updateURL(date: string, time: string) {
  history.pushState({}, "", `?date=${date}&time=${time}`);
}

export const Controls = () => {
  const run = useStore((s) => s.run);
  const posRef = useStore((s) => s.posRef);
  const speedFact = useStore((s) => s.speedFact);
  const speedmultiplier: number = useStore((s) => s.speedmultiplier);
  const [showMenu, setShowMenu] = useState(true);

  const stepFact = useTraceStore((s) => s.stepFact);
  const stepMultiplier: number = useTraceStore((s) => s.stepMultiplier);

  const dateRef = useRef(null);
  const timeRef = useRef(null);

  const intervalRef = useRef(null);
  // console.log("Controls render");

  useEffect(() => {
    //Get date & time from the URL
    const searchParams = new URLSearchParams(document.location.search);
    const urlDate = searchParams.get("date");
    const urlTime = searchParams.get("time");

    if (isValidDate(urlDate)) {
      posRef.current = dateTimeToPos(urlDate, posToTime(posRef.current));
    }

    if (isValidTime(urlTime)) {
      posRef.current = dateTimeToPos(posToDate(posRef.current), urlTime);
    }
  }, []);

  useLayoutEffect(() => {
    // console.log("Controls uselayout rendered");
    const timeout = setTimeout(() => {
      //We need to wait a little so that the
      //posref is updated
      dateRef.current.value = posToDate(posRef.current);
      timeRef.current.value = posToTime(posRef.current);

      if (!run) {
        updateURL(dateRef.current.value, timeRef.current.value);
      }
    }, 100);

    if (run) {
      intervalRef.current = setInterval(() => {
        if (document.activeElement !== dateRef.current) {
          dateRef.current.value = posToDate(posRef.current);
        }
        if (document.activeElement !== timeRef.current) {
          timeRef.current.value = posToTime(posRef.current);
        }
        // updateURL(dateRef.current.value, timeRef.current.value);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearTimeout(timeout);
  }, [run]);

  useControls(() => ({
    "1 sec/step equals": {
      value: speedmultiplier,
      step: 1,
      onChange: (v) => useStore.setState({ speedmultiplier: v }),
    },
    "\u{000D}": {
      value: speedFact,
      options: speedFactOpts,

      onChange: (v) => {
        useStore.setState({ speedFact: v });
      },
    },

    Trace: {
      value: useStore.getState().trace,
      onChange: (v) => useStore.setState({ trace: v }),
    },
    "Trace settings": folder(
      {
        "Dotted line": {
          value: useStore.getState().traceDots,
          onChange: (v) => useStore.setState({ traceDots: v }),
        },
        "Line width": {
          value: useTraceStore.getState().traceLinewidth,
          min: 1,
          max: 10,
          step: 1,
          onChange: (v) => useTraceStore.setState({ traceLinewidth: v }),
        },
        "Trace length": {
          value: useTraceStore.getState().traceLength,
          min: 1,
          max: 10000,
          step: 1,
          onChange: (v) => useTraceStore.setState({ traceLength: v }),
        },
        // "Trace step": {
        //   value: useTraceStore.getState().traceStepInput,
        //   min: 1,
        //   step: 1,
        //   onChange: (v) => useTraceStore.setState({ traceStepInput: v }),
        // },

        "1 step equals": {
          value: stepMultiplier,
          min: 1,
          step: 1,
          onChange: (v) => useTraceStore.setState({ stepMultiplier: v }),
        },
        " ": {
          value: stepFact,
          options: speedFactOpts,

          onChange: (v) => {
            useTraceStore.setState({ stepFact: v });
          },
        },

        "Update interval": {
          value: useTraceStore.getState().traceInterval,
          min: 1,
          max: 1000,
          step: 1,
          onChange: (v) => useTraceStore.setState({ traceInterval: v }),
        },
      },
      { collapsed: true }
    ),

    Positions: folder(
      {
        // "Copy all positions to the clipboard": button(() => {
        //   getAllPositions()
        //   alert("!");
        // }),
        tip: {
          label: "Tip:",
          value: "You can hover a planet to see its position",
          editable: false,
        },
      },
      { collapsed: true }
    ),
    Camera: folder(
      {
        cameratip: {
          label: "Tip:",
          value: "Double click a planet to center the camera on it",
          editable: false,
        },

        // "Look at": {
        //   value: useStore.getState().cameraTarget,
        //   options: {
        //     Earth: "Earth",
        //     "System Center": "SystemCenter",
        //     Sun: "Sun",
        //     Mars: "Mars",
        //     Venus: "Venus",
        //   },
        //   onChange: (v) => useStore.setState({ cameraTarget: v }),
        // },
        Follow: {
          value: useStore.getState().cameraFollow,
          onChange: (v) => useStore.setState({ cameraFollow: v }),
        },

        // "Camera type": {
        //   value: useStore.getState().activeCamera,
        //   options: { Orbit: "orbit", Fly: "fly" },
        //   onChange: (v) => useStore.setState({ activeCamera: v }),
        // },
      },
      { collapsed: true }
    ),
    Planets: folder(
      {
        "Planet sizes": {
          value: 1,
          min: -5,
          max: 5,
          step: 1,
        },
      },
      { collapsed: true }
    ),

    "Orbit settings": folder(
      {
        Orbits: {
          value: useStore.getState().orbits,
          onChange: (v) => useStore.setState({ orbits: v }),
        },
        Linewidth: {
          value: useStore.getState().orbitsLinewidth,
          min: 1,
          max: 10,
          step: 1,
          onChange: (v) => useStore.setState({ orbitsLinewidth: v }),
        },

        Arrows: {
          value: useStore.getState().arrows,
          onChange: (v) => useStore.setState({ arrows: v }),
        },
        "Arrow size": {
          value: useStore.getState().arrowScale,
          min: 1,
          max: 5,
          step: 1,
          onChange: (v) => useStore.setState({ arrowScale: v }),
        },
      },
      { collapsed: true }
    ),
    "Celestial settings": folder({}, { collapsed: true }),
  }));

  function dateKeyDown(e) {
    if (e.key !== "Enter") {
      return;
    }
    (document.activeElement as HTMLElement).blur();
    if (!isValidDate(dateRef.current.value)) {
      dateRef.current.value = posToDate(posRef.current);
      return;
    }
    posRef.current = dateTimeToPos(
      dateRef.current.value,
      posToTime(posRef.current)
    );
    dateRef.current.value = posToDate(posRef.current);
    timeRef.current.value = posToTime(posRef.current);
    updateURL(dateRef.current.value, timeRef.current.value);

    useStore.setState((s) => ({ runPosWriter: !s.runPosWriter }));
  }

  function timeKeyDown(e) {
    if (e.key !== "Enter") {
      return;
    }
    (document.activeElement as HTMLElement).blur();
    if (!isValidTime(timeRef.current.value)) {
      timeRef.current.value = posToTime(posRef.current);
      return;
    }
    posRef.current = dateTimeToPos(
      posToDate(posRef.current),
      timeRef.current.value
    );
    dateRef.current.value = posToDate(posRef.current);
    timeRef.current.value = posToTime(posRef.current);
    updateURL(dateRef.current.value, timeRef.current.value);
    useStore.setState((s) => ({ runPosWriter: !s.runPosWriter }));
  }

  function changeScale(newScale) {
    let div = document.getElementById("controls");
    div.style.transform = "scale(" + 0.5 + "," + 0.5 + ")";
  }

  return (
    <>
      {/* <Stats />z */}

      <div
        id="controls"
        className="flex flex-col max-h-[95vh] absolute top-0 m-1 w-80 bg-gray-900 opacity-80 rounded-md select-none"
      >
        <div className="flex ">
          <button
            className=" text-white px-1 py-2"
            onClick={() => {
              setShowMenu(!showMenu);
            }}
          >
            {showMenu ? <FaTimes /> : <FaBars />}
          </button>
          {/* <button
            className=" text-white px-1 py-2"
            onClick={() => {
              changeScale(0.1);
            }}
          >
            <FaMinus />
          </button>
          <button className=" text-white px-1 py-2" onClick={() => {}}>
            <FaPlus />
          </button> */}
          <h2 className=" font-cambria text-white text-3xl text-center italic font-bold">
            The TYCHOSIUM
          </h2>
          {/* <button
            className=" bg-gray-700 rounded text-white px-1 py-2"
            onClick={() => {}}
          >
            <FaInfo />
          </button> */}
        </div>
        <div>
          <div className="flex justify-end m-1 mr-1">
            <button
              className="bg-gray-700 text-white rounded ml-2 px-4"
              onClick={() => {
                posRef.current = 0;
                dateRef.current.value = posToDate(posRef.current);
                timeRef.current.value = posToTime(posRef.current);
                updateURL(dateRef.current.value, timeRef.current.value);
                useStore.setState((s) => ({ runPosWriter: !s.runPosWriter }));
              }}
            >
              Reset
            </button>
            <button
              className="bg-gray-700 text-white rounded ml-2 px-4"
              onClick={() => {
                const todayPos =
                  sDay *
                  dateToDays(
                    new Intl.DateTimeFormat("sv-SE", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }).format(Date.now())
                  );
                posRef.current = todayPos;
                dateRef.current.value = posToDate(posRef.current);
                timeRef.current.value = posToTime(posRef.current);
                updateURL(dateRef.current.value, timeRef.current.value);
                useStore.setState((s) => ({ runPosWriter: !s.runPosWriter }));
              }}
            >
              Today
            </button>
            <button
              className="bg-gray-700 text-white rounded ml-2 px-4"
              onClick={() => {
                if (speedFact === sYear) {
                  //If it is a year, we need some special logic

                  posRef.current =
                    dateToDays(
                      addYears(dateRef.current.value, -speedmultiplier)
                    ) *
                      sDay +
                    timeToPos(timeRef.current.value);
                } else {
                  if (speedFact === sMonth) {
                    posRef.current =
                      dateToDays(
                        addMonths(dateRef.current.value, -speedmultiplier)
                      ) *
                        sDay +
                      timeToPos(timeRef.current.value);
                  } else {
                    posRef.current -= speedFact * speedmultiplier;
                  }
                }

                dateRef.current.value = posToDate(posRef.current);
                timeRef.current.value = posToTime(posRef.current);
                updateURL(dateRef.current.value, timeRef.current.value);
                useStore.setState((s) => ({ runPosWriter: !s.runPosWriter }));
              }}
            >
              <FaStepBackward />
            </button>
            <button
              className="bg-gray-700 text-white rounded ml-2 px-4"
              onClick={() => {
                useStore.setState((state) => ({ run: !state.run }));
              }}
            >
              {run ? <FaPause /> : <FaPlay />}
            </button>
            <button className="bg-gray-700 text-white rounded ml-2 px-4">
              <FaStepForward
                onClick={() => {
                  if (speedFact === sYear) {
                    //If it is a year, we need some special logic

                    posRef.current =
                      dateToDays(
                        addYears(dateRef.current.value, speedmultiplier)
                      ) *
                        sDay +
                      timeToPos(timeRef.current.value);
                  } else {
                    if (speedFact === sMonth) {
                      posRef.current =
                        dateToDays(
                          addMonths(dateRef.current.value, speedmultiplier)
                        ) *
                          sDay +
                        timeToPos(timeRef.current.value);
                    } else {
                      posRef.current += speedFact * speedmultiplier;
                    }
                  }
                  dateRef.current.value = posToDate(posRef.current);
                  timeRef.current.value = posToTime(posRef.current);
                  updateURL(dateRef.current.value, timeRef.current.value);
                  useStore.setState((s) => ({ runPosWriter: !s.runPosWriter }));
                }}
              />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center m-1">
          <label className="text-base text-white mr-2 ml-1 flex-1">Date:</label>
          <input
            className="text-base text-white bg-gray-700 rounded p-1"
            ref={dateRef}
            onKeyDown={dateKeyDown}
          />
        </div>
        <div className="flex items-center justify-center m-1">
          <label className="text-base text-white mr-2 ml-1 flex-1">
            Time (UTC):
          </label>
          <input
            className="text-base text-white bg-gray-700 rounded p-1"
            ref={timeRef}
            onKeyDown={timeKeyDown}
          />
        </div>
        <div hidden={!showMenu} className="mt-2 overflow-auto">
          <Leva
            neverHide
            fill
            titleBar={false}
            theme={{
              colors: { highlight1: "#FFFFFF", highlight2: "#FFFFFF" },
            }}
          />
        </div>
        {/* ) : null} */}
      </div>
    </>
  );
};
