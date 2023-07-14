import React, { useState, useEffect, useRef } from "react";
import * as Tone from "tone";

const Synthesizer = () => {
  const [synth, setSynth] = useState(null);
  const [pressedKeys, setPressedKeys] = useState([]);
  const containerRef = useRef(null);

  const keys = [
    { note: "c4", keyPress: "a", class: "whiteKeys" },
    { note: "c#4", keyPress: "w", class: "blackKeys" },
    { note: "d4", keyPress: "s", class: "whiteKeys" },
    { note: "d#4", keyPress: "e", class: "blackKeys" },
    { note: "e4", keyPress: "d", class: "whiteKeys" },
    { note: null, keyPress: null, class: "blackKeys" },
    { note: "f4", keyPress: "f", class: "whiteKeys" },
    { note: "f#4", keyPress: "t", class: "blackKeys" },
    { note: "g4", keyPress: "g", class: "whiteKeys" },
    { note: "g#4", keyPress: "y", class: "blackKeys" },
    { note: "a4", keyPress: "h", class: "whiteKeys" },
    { note: "a#4", keyPress: "u", class: "blackKeys" },
    { note: "b4", keyPress: "j", class: "whiteKeys" },
    { note: null, keyPress: null, class: "blackKeys" },
    // { note: "c5", keyPress: "k", class: "whiteKeys" },
  ];

  useEffect(() => {
    const newSynth = new Tone.PolySynth().toDestination();
    setSynth(newSynth);

    return () => {
      newSynth.dispose();
    };
  }, []);

  const handlePlay = (note) => {
    synth.triggerAttackRelease(note, "8n");
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const keyInfo = keys.find((key) => key.keyPress === event.key);
      if (keyInfo) {
        event.preventDefault();
        handlePlay(keyInfo.note);
        setPressedKeys((prevKeys) => [...prevKeys, keyInfo.keyPress]);
      }
    };

    const handleKeyUp = (event) => {
      const keyInfo = keys.find((key) => key.keyPress === event.key);
      if (keyInfo) {
        setPressedKeys((prevKeys) =>
          prevKeys.filter((key) => key !== keyInfo.keyPress)
        );
        if (pressedKeys.length === 1) {
          synth.triggerRelease();
        }
      }
    };

    const container = containerRef.current;
    container.addEventListener("keydown", handleKeyDown);
    container.addEventListener("keyup", handleKeyUp);

    // Focus the container div when the component mounts
    container.focus();

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      container.removeEventListener("keyup", handleKeyUp);
    };
  }, [keys, pressedKeys, synth, handlePlay]);

  const clickKey = (note) => {
    synth.triggerAttackRelease(note, "2n");
  };

  return (
    <div className="piano" ref={containerRef} tabIndex={0}>
      <div className="pianoCont">
        {keys.map((keyInfo) => (
          <div className="note" key={keyInfo.note}>
            <button
              className={`${keyInfo.class} pianoKey ${
                keyInfo.note === null ? "hideKey" : null
              }`}
              id={keyInfo.note}
              onClick={() =>
                clickKey(keyInfo.note === null ? "" : keyInfo.note)
              }
            ></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Synthesizer;
