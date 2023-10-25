'use client'
import styles from './page.module.css'
import Segment from 'components/Segment'
import { MouseEvent, useEffect, useState } from 'react'

export default function Home() {

  const resolution = {width: 12, height:21};
  const [windowResolution, setWindowResolution] = useState({ width: 0, height: 0 });
  const [segments, setSegments] = useState<number[][][]>([]);

  useEffect(() => {
    setWindowResolution({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", () => {
        setWindowResolution({ width: window.innerWidth, height: window.innerHeight });
    });
    let segments_temp: number[][][] = [];
    for (let i = 0; i < resolution.height; i++) {
      let row_temp: number[][] = []
      for (let j = 0; j < resolution.width; j++) {
        const x = Math.round(Math.random()*4)-2;
        const y = Math.round(Math.random()*4)-2;
        row_temp.push([x, y, 0]);
      }
      segments_temp.push(row_temp);
    }
    setSegments(segments_temp);
    random();
  }, []);

  const [clickedCordinate, setClickedCordinate] = useState({ x: 0, y: 0 });
  const [isClicked, setIsClicked] = useState(false);

  const handlerMouseDown = (event: MouseEvent) => {
    const clickedX = Math.floor(event.clientX / (windowResolution.width / resolution.width));
    const clickedY = Math.floor(event.clientY / (windowResolution.height / resolution.height));
    setClickedCordinate({ x: clickedX, y: clickedY });
    setIsClicked(true);
  }

  const handlerMouseUp = (event: MouseEvent) => {
    setIsClicked(false);
  }

  const [isRandom, setIsRandom] = useState(false);
  const [randomData, setRandomData] = useState({ x: 0, y: 0,  limit: 0});
  function random() {
    const timer = Math.floor(Math.random() * 3500) + 500;
    // const rx = Math.floor(Math.random() * resolution.width);
    // const ry = Math.floor(Math.random() * resolution.height);
    // const limit = Math.random()* 1.5+ 2.5;
    // setRandomData({ x: rx, y: ry, limit: limit});
    // setIsRandom(true);
    // setTimeout(() => { setIsRandom(false); }, 500);
    
    let segments_temp: number[][][] = [];
    for (let i = 0; i < resolution.height; i++) {
      let row_temp: number[][] = []
      for (let j = 0; j < resolution.width; j++) {
        const x = Math.round(Math.random()*4)-2;
        const y = Math.round(Math.random()*4)-2;
        row_temp.push([x, y, timer/1000]);
      }
      segments_temp.push(row_temp);
    }
    setSegments(segments_temp);

    setTimeout(() => { random(); }, timer);
  }


  return (
    <main className={styles.main}>
      {
        segments.map((row, row_idx) => <div key={row_idx} className={styles.row}>
          {row.map((col, col_idx) => (<div key={col_idx} className={styles.col}>
            <Segment coordinate={{ x: col_idx, y: row_idx }} isClicked={isClicked} clickedCordinate={clickedCordinate} isRandom={isRandom} randomData={randomData} data={segments[row_idx][col_idx]}/>
          </div>)
          )}
        </div>)
      }
      <img className={styles.fixed} src='/text.png' />
      <div className={styles.feedback} onMouseDown={handlerMouseDown} onMouseUp={handlerMouseUp} />
    </main>
  )
}
