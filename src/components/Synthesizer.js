import React, { useState, useEffect, useRef } from "react";
import * as Tone from "tone";

const Synthesizer = () => {
  const [synth, setSynth] = useState(null);
  const [pressedKeys, setPressedKeys] = useState([]);
  const containerRef = useRef(null);

  const keys = [
    { note: "c4", keyPress: "a" },
    { note: "c#4", keyPress: "w" },
    { note: "d4", keyPress: "s" },
    { note: "d#4", keyPress: "e" },
    { note: "e4", keyPress: "d" },
    { note: "f4", keyPress: "f" },
    { note: "f#4", keyPress: "t" },
    { note: "g4", keyPress: "g" },
    { note: "g#4", keyPress: "y" },
    { note: "a4", keyPress: "h" },
    { note: "a#4", keyPress: "u" },
    { note: "b4", keyPress: "j" },
    { note: "c5", keyPress: "k" },
  ];

  useEffect(() => {
    const newSynth = new Tone.Synth().toDestination();
    setSynth(newSynth);

    return () => {
      newSynth.dispose();
    };
  }, []);

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
  }, [keys, pressedKeys, synth]);

  const handlePlay = (note) => {
    synth.triggerAttack(note);
  };

  return (
    <div ref={containerRef} tabIndex={0}>
      <h1>Synthesizer</h1>
      {keys.map((keyInfo) => (
        <div className="note" key={keyInfo.note}>
          <button>{keyInfo.note}</button>
        </div>
      ))}
    </div>
  );
};

export default Synthesizer;
