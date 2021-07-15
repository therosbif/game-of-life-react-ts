import "./App.css";

import React, { useCallback, useEffect, useRef, useState } from "react";
import produce from "immer";

const translations = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const numRows = 50
const numCols = 50

const App: React.FC = () => {

  const [density, setDensity] = useState(0.5);

  const [stopped, setStopped] = useState(true);
  const stoppedRef = useRef(stopped);

  const generateGrid = (density = 0) => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(
        Array.from(Array(numCols), () => ((Math.random() < density ? 1 : 0) as number))
      );
    }
    return rows;
  };

  const [grid, setGrid] = useState(() => {
    return generateGrid();
  });

  const runSimulation = useCallback(() => {
    if (!stoppedRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbours = 0;

            translations.forEach(([x, y]) => {
              if (
                i + x >= 0 &&
                i + x < numRows &&
                j + y >= 0 &&
                j + y < numCols
              ) {
                neighbours += g[i + x][j + y];
              }
            });

            if (neighbours < 2 || neighbours > 3) {
              gridCopy[i][j] = 0;
            } else if (neighbours === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 100);
  }, []);

  return (
    <>
      <div style={{ display: "flex" }}>
        <button
          style={{backgroundColor: stopped ? 'lime' : "red"}}
          onClick={() => {
            setStopped(!stopped);
            stoppedRef.current = stopped;
            runSimulation();
          }}
        >
          {stopped ? "start" : "stop"}
        </button>
        <div style={{width: '20px'}}/>
        <button
          onClick={() => {
            setGrid(generateGrid());
          }}
        >
          clear
        </button>
        <button
          onClick={() => {
            setGrid(generateGrid(density));
          }}
        >
          generate
        </button>
        <div style={{width: '20px'}}/>
        <label htmlFor="density">Density: </label>
        <input
          type="range"
          min={0}
          max={100}
          defaultValue={density * 100}
          onChange={(d) => {
            setDensity(d.target.valueAsNumber / 100);
          }}
        />
        <a>{density}</a>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((row, i) =>
          row.map((col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][j] = 1 - gridCopy[i][j];
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][j] ? "red" : undefined,
                border: "solid 1px black",
              }}
            />
          ))
        )}
      </div>
    </>
  );
};

export default App;
