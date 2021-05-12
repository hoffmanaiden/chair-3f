import React, { Suspense, useRef, useEffect } from "react";
import "./App.scss";
//Components
import Header from "./components/header";
import { Section } from "./components/section"
import { Canvas, useFrame } from "react-three-fiber"
import { Html, useGLTFLoader } from "drei"

// page state
import state from './components/state'

// intersection observer
import {useInView} from 'react-intersection-observer';

// https://www.youtube.com/watch?v=Qs9A3XIjbg4&list=LL&index=3&t=837s
// left off at 35:25 min

const Model = ({ modelPath }) => {
  const gltf = useGLTFLoader(modelPath, true)
  return <primitive object={gltf.scene} dispose={null} />
}

const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[0, 10, 0]} intensity={1.5} />
      <spotLight intensity={1} position={[1000, 1000, 0]} />
    </>
  );
}

const HTMLContent = ({bgColor, domContent, children, modelPath, positionY }) => {
  const ref = useRef()
  useFrame(() => (ref.current.rotation.y += 0.01))
  const [refItem, inView] = useInView({
    threshold: 0
  })

  useEffect(() => {
    inView && (document.body.style.background = bgColor)
  }, [inView])
  return (
    <Section factor={1.5} offset={1}>
      <group position={[0, positionY, 0]}>
        <mesh ref={ref} position={[0, -35, 0]}>
          <Model modelPath={modelPath} />
        </mesh>
        <Html portal={domContent} fullscreen>
          <div className="view" ref={refItem}>

          </div>
          {children}
        </Html>
      </group>
    </Section>
  )
}

export default function App() {
  const domContent = useRef()
  const scrollArea = useRef()

  const onScroll = (e) => (state.top.current = e.target.scrollTop)
  useEffect(() => void onScroll({target: scrollArea.current}), [])
  return (
    <>
      <Header />
      <Canvas
        colorManagement
        camera={{ position: [0, 0, 120], fov: 70 }}
      >
        <Lights />
        <Suspense fallback={null}>
          <HTMLContent domContent={domContent} modelPath={'/armchairYellow.gltf'} positionY={250} bgColor={'#fcf75d'}>
            <div className='container'>
              <h1 className='title'>Yellow</h1>
            </div>
          </HTMLContent>
          <HTMLContent domContent={domContent} modelPath={'/armchairGreen.gltf'} positionY={0} bgColor={'#8cff83'}>
            <div className='container'>
              <h1 className='title'>Green</h1>
            </div>
          </HTMLContent>
          <HTMLContent domContent={domContent} modelPath={'/armchairGray.gltf'} positionY={-250} bgColor={'#636567'}>
            <div className='container'>
              <h1 className='title'>Gray</h1>
            </div>
          </HTMLContent>
        </Suspense>
      </Canvas>
      <div className="scrollArea" ref={scrollArea} onScroll={onScroll}>
        <div style={{position: 'sticky', top:0}} ref={domContent}></div>
        <div style={{height: `${state.sections * 100}vh`}}></div>
      </div>
    </>
  );
}
