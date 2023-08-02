import React, { useEffect, useState } from 'react';
import viteLogo from './assets/vite.svg';
import reactLogo from './assets/react.svg';
import { animated, useSpring, config, SpringRef } from '@react-spring/web';

const items = Array.from({length: 50}, (_, i) => i);
const itemSize = 80; // Adjust according to your image size

type SpringType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key:string]: any;
}

function App() {
  const [firstAnimationDone, setFirstAnimationDone] = useState(false);
  const [itemPositions, setItemPositions]:[SpringType,React.Dispatch<React.SetStateAction<object>>] = useState(() =>
    items.reduce((acc, index) => ({
      ...acc,
      [index]: { x: 0, y: 0 },
    }), {}),
  );
  const [springs, api]: [SpringType,SpringRef] = useSpring(() => ({
    ...items.reduce((acc, index) => ({
      ...acc,
      [`x${index}`]: 0,
      [`y${index}`]: 0,
    }), {}),
    config: config.molasses, // Set the configuration to a slower animation
  }));

  useEffect(() => {
    const card = document.getElementById('card');
    const cw = card?.clientWidth;
    const ch = card?.clientHeight;
    const [x, y] = [cw ? cw : 0, ch ? ch : 0];
    const [displayX, displayY] = [x, y];

    const checkOverlap = (newX: number, newY: number, index: number) => {
      for (const key in itemPositions) {
        if (Number(key) !== index) {
          const otherItem = itemPositions[key];
          if (
            Math.abs(newX - otherItem.x) < itemSize &&
            Math.abs(newY - otherItem.y) < itemSize
          ) {
            return true;
          }
        }
      }
      return false;
    };

    // Update the position for each item
    items.forEach((index) => {
      const move = () => {
        let newX: number, newY: number;
        do {
          newX = Math.floor(Math.random() * (displayX - 2 * itemSize) + itemSize);
          newY = Math.floor(Math.random() * (displayY - 2 * itemSize) + itemSize);
        } while (checkOverlap(newX, newY, index));

        api.start({
          [`x${index}`]: newX,
          [`y${index}`]: newY,
          config: firstAnimationDone ? { tension: 250, friction: 250 } : config.molasses,
          onRest: () => {
            if (!firstAnimationDone) {
              setFirstAnimationDone(true);
            }
            move(); // Loop the animation
          },
        });

        setItemPositions((prev) => ({ ...prev, [index]: { x: newX, y: newY } }));
      };

      // Start the animation
      move();
    });
  }, [firstAnimationDone]);

  return (
    <div id="card">
      {items.map((index) => (
        <animated.div
          key={index}
          style={{
            position: 'absolute',
            left: springs[`x${index}` as string],
            top: springs[`y${index}`as string],
          }}
        >
          <div className="flame" onClick={() => {confirm(`index => ${index}の要素\n※ index = 0から始まるので+1してます`)}}>
            <img id="vite" src={viteLogo} alt="vite logo" />
            <img id="react" src={reactLogo} alt="React logo" />
            <p>{index + 1}</p>
          </div>
        </animated.div>
      ))}
    </div>
  );
}

export default App;
