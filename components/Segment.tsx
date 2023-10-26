'use client'

import { useEffect, useRef, useState } from 'react';
import styles from './Segment.module.css'

type SegmentType = {
    coordinate: { x: number, y: number },
    windowResolution: { width: number, height: number },
    resolution: { width: number, height: number },
    position: { top: number, left: number, direction: string },
    isClicked: boolean,
    clickedCordinate: { x: number, y: number },
    isRandom: boolean,
    randomData: { x: number, y: number, limit: number },
    big: {x: number, y: number, size: number}[]
}

export default function Segment({ coordinate, windowResolution, resolution, position, isClicked, clickedCordinate, isRandom, randomData, big }: SegmentType) {
    let sizeResolution = resolution;
    let isTop = false;
    big.forEach((data)=>{
        if(Number(data.x) == coordinate.x && Number(data.y) == coordinate.y) {
            isTop = true;
            sizeResolution = {width: resolution.width/Number(data.size), height: resolution.height/Number(data.size)}
        }
    });

    const distance = Math.sqrt(Math.pow(coordinate.x - clickedCordinate.x, 2) + Math.pow(coordinate.y - clickedCordinate.y, 2));

    let count = 0;
    let timer = 0;
    let isMax = false;
    const limit = 6;
    const amplitude = 60;
    const itemRef = useRef<HTMLDivElement>(null);

    function click() {
        if (distance > limit) return;
        const ani = requestAnimationFrame(click);
        if (itemRef.current) {
            count++;
            if (count > distance * 10) {
                timer++;
                if (!isMax) {
                    const amplitude_ = amplitude + ((90 - amplitude) * distance / limit);
                    itemRef.current.style.setProperty("width", amplitude_ + "%");
                    itemRef.current.style.setProperty("height", amplitude_ + "%");
                    isMax = true;
                }
                if (isMax && timer > 50) {
                    itemRef.current.style.setProperty("width", "100%");
                    itemRef.current.style.setProperty("height", "100%");
                    isMax = false;
                    timer = 0;
                    count = 0;
                    cancelAnimationFrame(ani);
                }
            }
        }
    }



    useEffect(() => {
        if (isClicked) {
            console.log('active');
            click();
        }
    }, [isClicked]);




    const randomDistance = Math.sqrt(Math.pow(coordinate.x - randomData.x, 2) + Math.pow(coordinate.y - randomData.y, 2));

    let randomCount = 0;
    let randomTimer = 0;
    let randomIsMax = false;
    const randomLimit = randomData.limit;
    const randomAmplitude = 90;
    const randomRef = useRef<HTMLDivElement>(null);

    function random() {
        if (randomDistance > randomLimit) return;
        const ani = requestAnimationFrame(random);
        if (randomRef.current) {
            randomCount++;
            if (randomCount > randomDistance * 30) {
                randomTimer++;
                if (!randomIsMax) {
                    const randomAmplitude_ = randomAmplitude + ((95 - randomAmplitude) * randomDistance / randomLimit);
                    randomRef.current.style.setProperty("width", randomAmplitude_ + "%");
                    randomRef.current.style.setProperty("height", randomAmplitude_ + "%");
                    randomIsMax = true;
                }
                if (randomIsMax && randomTimer > 200) {
                    randomRef.current.style.setProperty("width", "100%");
                    randomRef.current.style.setProperty("height", "100%");
                    randomIsMax = false;
                    randomTimer = 0;
                    randomCount = 0;
                    cancelAnimationFrame(ani);
                }
            }
        }

    }

    useEffect(() => {
        if (isRandom) {
            random();
        }
    }, [isRandom]);

    return (
        <div className={styles.root} style={{
            overflow: "hidden",
            width: windowResolution.width / sizeResolution.width + "px",
            height: windowResolution.height / sizeResolution.height + "px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: isTop?999:0,
            backgroundColor: "white",
            border: "1px solid white"
        }}>
            <div ref={randomRef} style={{
                overflow: "hidden",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                transition: "1s"
            }}>
                <div ref={itemRef} className="" style={{
                    overflow: "hidden",
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    // left: "1px",
                    // top: "1px",
                    transition: "0.5s"
                }}>
                    <img src='/back.png' alt='segment' style={
                        {
                            position: "absolute",
                            width: position.direction === "width" ? "100vw" : "auto",
                            height: position.direction === "height" ? "100vh" : "auto",
                            top: position.top + "px",
                            left: position.left + "px"
                        }
                    } />
                </div>
            </div>
        </div>
    )
}