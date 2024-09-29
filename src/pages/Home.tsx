import React, { useEffect, useRef, useState } from 'react'
import {SWATCHES} from '@/constant';
import { ColorSwatch,Group} from "@mantine/core"
import { Button } from '@/components/ui/button';
import axios from  'axios';
// import {GeneratedResult} from '@/utils/interfaces'

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing,setIsDrawing] = useState(false)
    const [color,setColor] = useState('rgb(255,255,255)')
    const [reset,setReset] = useState(false)
    const [dictOfVars, ] = useState({});
    // const [result, setResult] = useState<GeneratedResult>();
    
    useEffect(()=>{
        const canvas = canvasRef.current
        if (canvas) {
            const ctx = canvas.getContext('2d')
            if (ctx) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight
                ctx.lineCap = 'round'
                ctx.lineWidth = 3
            }
        }
    },[])

    useEffect(()=>{
        if(reset){
            resetCanvas()
            setReset(false)
        }
    },[reset])

    const resetCanvas = () =>{
        const canvas = canvasRef.current
        if(canvas){
            const ctx = canvas.getContext('2d')
            if (ctx) {
                ctx.clearRect(0,0,canvas.width,canvas.height)
            }
        }
    }

    const startDrawing = (e:React.MouseEvent<HTMLCanvasElement>) =>{
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.style.background = 'black'
            const ctx = canvas.getContext('2d')
            if (ctx) {
                ctx.beginPath()
                ctx.moveTo(e.nativeEvent.offsetX,e.nativeEvent.offsetY)
                setIsDrawing(true)
            }
        }
    }

    const stopDrawing = () =>{
        setIsDrawing(false)
    }

    const draw = (e:React.MouseEvent<HTMLCanvasElement>) =>{
        if (!isDrawing) {
            return
        }
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d')
            if (ctx) {
                ctx.strokeStyle = color
                ctx.lineTo(e.nativeEvent.offsetX,e.nativeEvent.offsetY)
                ctx.stroke()
            }
        }

    }
    const sendData = async() =>{
        const canvas = canvasRef.current
        if(canvas){
            const data = {
                image : canvas.toDataURL('image/png'),
                dict_Of_Vars : dictOfVars
            }
            const response = await axios.post('',data)
            const resp = await response.data
            console.log(resp);
            
        }
    }
  return (
    <>
    <div className='grid grid-cols-3 gap-2'>
        <Button onClick={()=>{
            setReset(true)
        }}
        className='z-20 bg-black text-white'
        variant='default'
        color='black'
        >Reset</Button>
         <Group className='z-20'>
                    {SWATCHES.map((swatch:string) => (
                        <ColorSwatch key={swatch} color={swatch} onClick={() => setColor(swatch)} />
                    ))}
        </Group>
         <Button onClick={sendData}
        className='z-20 bg-black text-white'
        variant='default'
        color='black'
        >Send</Button>
    </div>
    <canvas
        ref={canvasRef}
        id='canvas'
        className='absolute top-0 left-0 w-full h-full'
        onMouseDown={startDrawing}
        onMouseOut={stopDrawing}
        onMouseMove={draw}
    ></canvas></>
  )
}

