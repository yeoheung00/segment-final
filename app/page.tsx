'use client'
import styles from './page.module.css'
import Segment from 'components/Segment'
import { MouseEvent, useEffect, useState } from 'react'

export default function Home() {
  const backgroundResolution = { width: 1360, height: 1920 };
  const [resolution, setResolution] = useState({ width: 12, height: 21 });
  const [windowResolution, setWindowResolution] = useState({ width: 0, height: 0 });
  const [segments, setSegments] = useState<{ top: number, left: number, direction: string }[][]>([]);
  const [big, setBig] = useState<{ x: number, y: number, size: number }[]>([]);
  const [three, setThree] = useState<string[]>([]);

  useEffect(() => {
    //console.log('start');
    setWindowResolution({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", () => {
      setWindowResolution({ width: window.innerWidth, height: window.innerHeight });
    });
    random();
  }, []);

  useEffect(() => {
    //console.log('windowResolution', windowResolution);
    let tempResolution = { width: 12, height: 12 };
    if (windowResolution.width > windowResolution.height) {
      tempResolution.width = Math.round(12 * windowResolution.width / windowResolution.height);
      tempResolution.height = 12;
      while (tempResolution.height > 0) {
        if (tempResolution.width * tempResolution.height < 300) break;
        tempResolution.height--;
        tempResolution.width = Math.round(tempResolution.height * windowResolution.width / windowResolution.height);
      }
    } else {
      tempResolution.width = 12;
      tempResolution.height = Math.round(12 * windowResolution.height / windowResolution.width);
      while (tempResolution.width > 0) {
        if (tempResolution.width * tempResolution.height < 300) break;
        tempResolution.width--;
        tempResolution.height = Math.round(tempResolution.width * windowResolution.height / windowResolution.width);
      }
    }
    setResolution(tempResolution);
  }, [windowResolution]);

  useEffect(() => {
    if (resolution.width > 4 && resolution.height > 4) {
      let tempCoordinate: { x: number, y: number, size: number }[] = [];
      for (let i = 0; i < 5; i++) { //======================================================== 5개의 정사각형 구하기

        const size = Math.round(Math.sqrt(Math.random() * 12 + 4)); //======================== 2~4의 정사각형 변의 길이
        const x = Math.round(Math.random() * (resolution.width - size)); //=================== 정사각형의 좌측상단 x좌표
        const y = Math.round(Math.random() * (resolution.height - size)); //================== 정사각형의 좌측상단 y좌표

        tempCoordinate.push({ x: x, y: y, size: size }); //=================================== 정사각형 데이터 배열에 넣음

        for (let j = 0; j < tempCoordinate.length-1; j++) { //================================ 이전에 생성했던 정사각형들과 겹치는지 검사
          const data = tempCoordinate[j];
          if (isMeet({x: x, y: y, size: size}, {x: data.x, y: data.y, size: data.size})) { //= 만약 겹친다면,
            tempCoordinate.pop(); //========================================================== 마지막에 집어넣은 요소 빼기
            i--; //=========================================================================== 뺐으니 한번 더 실행하게 i 1감소
            break; //========================================================================= 검사 종료
          }
        };
      }
      setBig(tempCoordinate);
    }

  }, [resolution]);

  function isMeet(box1: { x: number, y: number, size: number }, box2: { x: number, y: number, size: number }) {
    const rec_x1 = box1.x
    const rec_y1 = box1.y
    const rec_x2 = box1.x + box1.size
    const rec_y2 = box1.y + box1.size

    const rec2_x1 = box2.x
    const rec2_y1 = box2.y
    const rec2_x2 = box2.x + box2.size
    const rec2_y2 = box2.y + box2.size

    const maxrec_x = Math.max(rec_x1, rec_x2)
    const minrec_x = Math.min(rec_x1, rec_x2)
    const maxrec_y = Math.max(rec_y1, rec_y2)
    const minrec_y = Math.min(rec_y1, rec_y2)

    if (!(minrec_x < rec2_x1 && rec2_x1 < maxrec_x) &&
      !(minrec_x < rec2_x2 && rec2_x2 < maxrec_x) &&
      !(minrec_y < rec2_y1 && rec2_y1 < maxrec_y) &&
      !(minrec_y < rec2_y2 && rec2_y2 < maxrec_y))
      return false;
    else
      return true;
  }

  useEffect(()=>{ 
    console.log(big);
    console.log('isMeet?', isMeet({x: 5, y: 6, size: 4}, {x: 5, y:7, size: 2}));
  }, [big]);

  useEffect(() => {
    const direction = windowResolution.width / windowResolution.height > backgroundResolution.width / backgroundResolution.height ? "width" : "height";

    let segments_temp: { top: number, left: number, direction: string }[][] = [];
    for (let y = 0; y < resolution.height; y++) {
      let row_temp: { top: number, left: number, direction: string }[] = [];
      for (let x = 0; x < resolution.width; x++) {
        let top = 0;
        let left = 0;
        if (direction === "height") {
          top = (windowResolution.height / resolution.height) * y * -1;
          left = (backgroundResolution.width / backgroundResolution.height * windowResolution.height - windowResolution.width) / -2 - windowResolution.width / resolution.width * x;
        }
        else if (direction === "width") {
          top = (backgroundResolution.height / backgroundResolution.width * windowResolution.width - windowResolution.height) / -2 - windowResolution.height / resolution.height * y;
          left = (windowResolution.width / resolution.width) * x * -1;
        }
        row_temp.push({ top: top, left: left, direction: direction });
      }
      segments_temp.push(row_temp);
    }
    setSegments(segments_temp);
  }, [resolution])

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
  const [randomData, setRandomData] = useState({ x: 0, y: 0, limit: 0 });
  function random() {
    const timer = Math.floor(Math.random() * 3500) + 500;
    const rx = Math.floor(Math.random() * resolution.width);
    const ry = Math.floor(Math.random() * resolution.height);
    const limit = Math.random() * 1.5 + 2.5;
    setRandomData({ x: rx, y: ry, limit: limit });
    setIsRandom(true);
    setTimeout(() => { setIsRandom(false); }, 500);
    setTimeout(() => { random(); }, timer);
  }


  return (
    <main className={styles.main}>
      {
        segments.map((row, row_idx) => <div key={row_idx} className={styles.row}>
          {row.map((col, col_idx) => (<div key={col_idx} className={styles.col} style={{
            overflow: "visible",
            width: windowResolution.width / resolution.width + "px",
            height: windowResolution.height / resolution.height + "px"
          }}>
            <Segment coordinate={{ x: col_idx, y: row_idx }} windowResolution={windowResolution} resolution={resolution} position={segments[row_idx][col_idx]} isClicked={isClicked} clickedCordinate={clickedCordinate} isRandom={isRandom} randomData={randomData} big={big} />
          </div>)
          )}
        </div>)
      }
      <img className={styles.fixed} src='/text.png' />
      <div className={styles.feedback} onMouseDown={handlerMouseDown} onMouseUp={handlerMouseUp} />
    </main>
  )
}
