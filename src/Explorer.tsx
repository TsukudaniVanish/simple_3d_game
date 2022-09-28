import { useEffect } from "https://jspm.dev/npm:react@17.0.0/cjs/react.development.js!cjs"
import {react, React, explorerConfig as gameConfig, Three} from "../deps.ts"

type MousePos = {
    x: number
    y:number
}

export const Game = react.memo(() => {
    const canvasRef = react.useRef(HTMLCanvasElement.prototype)

    const mousePos = react.useRef({x:0, y:0})


    // renderer 
    react.useEffect(() => {
        // 1 define mouse moving 
        canvasRef.current.addEventListener('mousemove', function(e) {
            let mpos:MousePos = getMousePos(canvasRef.current,e)
            mousePos.current = {
                x: (gameConfig.display_width / 2) - mpos.x,
                y: (gameConfig.display_hight / 2) - mpos.y 
            }
        }, false)

        // 2 define renderer
        const renderer: Three.WebGLRenderer = new Three.WebGLRenderer({
            canvas: canvasRef.current 
        })
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(gameConfig.display_width, gameConfig.display_hight)

        const scene: Three.Scene = new Three.Scene()

        const camera: Three.PerspectiveCamera = new Three.PerspectiveCamera(gameConfig.player_fov, gameConfig.display_hight / gameConfig.display_width, 0.1, 2000)
        camera.position.set(0, 1000, -500)

        // make floor 
        const floorGeometry: Three.BoxGeometry = new Three.BoxGeometry(500 * 2, 400 ,100000)
        const floorMaterial: Three.MeshBasicMaterial = new Three.MeshBasicMaterial({color:0xFFFFFFFF})
        const floor: Three.Mesh = new Three.Mesh(floorGeometry, floorMaterial)
        floor.position.set(0, 0, -3000)
        scene.add(floor)


        // make horizontal light
        const directionalLight: Three.DirectionalLight = new Three.DirectionalLight('red')
        directionalLight.position.set(0, camera.position.y + 100, 0)
        scene.add(directionalLight)

        // rendering 
        tick() 

        function tick() {
            camera.lookAt(new Three.Vector3(0, 0, 1000))

            renderer.render(scene, camera)

            requestAnimationFrame(tick)
        }
    }, [])

    function getMousePos (canvas: HTMLCanvasElement, e: HTMLElementEventMap['mousemove']): MousePos {
        const rect: DOMRect = canvas.getBoundingClientRect()
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top 
        }
    }

    return (
        <>
            <canvas ref={canvasRef}/>
        </>
    )
})