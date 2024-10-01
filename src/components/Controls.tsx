import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useStore, useTraceStore } from "../store";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import {
  posToDate,
  posToTime,
  isValidDate,
  dateTimeToPos,
  dateToDays,
  addYears,
  addMonths,
  timeToPos,
  isValidTime,
  sDay,
  sMonth,
  sYear,
} from "../utils/time-date-functions";
import { Stats } from "@react-three/drei";
import { Leva } from "leva";
import { useLevaControls } from "./useLevaControls";

function updateURL(date: string, time: string) {
  /* How to access the correct camera info? :) */
  /* (camera:Camera and &${camera.getWorldQuaternion.name}) */
  history.pushState({}, "", `?date=${date}&time=${time}`);
}

export const Controls = () => {
  const run = useStore((s) => s.run);
  const posRef = useStore((s) => s.posRef);
  const speedFact = useStore((s) => s.speedFact);
  const speedmultiplier: number = useStore((s) => s.speedmultiplier);
  /* Mobile responsiveness breakpoint */
  const [showMenu, setShowMenu] = useState(window.innerWidth >= 768);

  const stepFact = useTraceStore((s) => s.stepFact);
  const stepMultiplier: number = useTraceStore((s) => s.stepMultiplier);

  const dateRef = useRef(null);
  const timeRef = useRef(null);

  const intervalRef = useRef(null);

  const menuRight = useStore((s) => s.menuRight);
  const showStats = useStore((s) => s.showStats);

  // Sidebar.tsx coupling, local storage
  const [isLeft, setIsLeft] = useState(true);

  //A custom hook for the leva controls with an update function
  useLevaControls();

  // Load `isLeft` state from local storage
  useEffect(() => {
    const savedIsLeft = localStorage.getItem("sidebarPosition");
    if (savedIsLeft) {
      setIsLeft(JSON.parse(savedIsLeft));
    }
  }, []);

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
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearTimeout(timeout);
  }, [run]);

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

  function LeftArrowKeyDown(e) {
    if (e.key !== "ArrowLeft") {
      return;
    }
    console.log("LeftArrowKey Pressed");
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
    /* Use tailwind scales instead?*/
    div.style.transform = "scale(" + 0.5 + "," + 0.5 + ")";
  }

  return (
    <>
      {showStats ? <Stats /> : null}
      <div
        id="controls"
        className={`flex flex-col max-h-[95vh] absolute top-0
          ${menuRight ? "right-0" : "left-0"}
          m-1 bg-gray-900 opacity-80 rounded-md select-none`}
      >
        <div className="flex items-center">
          <button
            className="flex items-center text-2xl text-white px-1 py-2"
            onLoad={() => {
              setShowMenu(!showMenu);
            }}
            onClick={() => {
              setShowMenu(!showMenu);
            }}
          >
            {showMenu ? <FaTimes /> : <FaBars />}
            <span className="p-1 ml-2 text-2xl font-cambria text-white text-center font-bold">
              The TYCHOSIUM
            </span>
          </button>
        </div>

        <div>
          <div className="flex justify-end m-1 my-1 mr-1 text-1xl">
            <button
              className="bg-gray-700 text-white rounded ml-2 px-3"
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
        <div
          hidden={!showMenu}
          className="mt-2 overflow-auto text-lg custom-leva leva"
        >
          <Leva /* Change the font font so that it is coherent to other panels */
            neverHide
            fill
            titleBar={false}
            theme={{
              colors: { highlight1: "#FFFFFF", highlight2: "#FFFFFF" },
              fonts: {
                mono: "'Roboto', sans-serif",
              },
            }}
          />
        </div>
        {/* ) : null} */}
      </div>
    </>
  );
};
