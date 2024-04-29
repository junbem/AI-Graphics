App.css

body {
    margin: 0;
    padding: 0;
}


#root {
    width: 100%;
    height: 100vh;
}

App.jsx
import './App.css'
import { Canvas } from '@react-three/fiber'
import MyElement3D from './MyElement3D'

function App() {
  return (
    <>
      <Canvas>
        <MyElement3D />
      </Canvas>
    </>
  )
}

export default App

MyElement3D.jsx
import './App.css'
import { Canvas } from '@react-three/fiber'
import MyElement3D from './MyElement3D'

function App() {
  return (
    <>
      <Canvas>
        <MyElement3D />
      </Canvas>
    </>
  )
}

export default App
