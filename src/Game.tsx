import { gameConfig, react, Three, React } from "../deps.ts";



type Box = {
    box: Three.Mesh;
    isMoving:boolean;
}

type MousePos = {
    x:number;
    y:number;
}

enum GameMode {
    ModeQuit,
    ModeInit,
    ModeNormal,
}

export const Game = react.memo(() => {
    // game loop

    // state which holds game state
    const [gameMode, setGameMode] = react.useState(GameMode.ModeNormal)

    // hold canvas
    const canvasRef = react.useRef(HTMLCanvasElement.prototype)

    // hold mouse position
    const mousePositionXRef = react.useRef(0)

    // hold game mode
    const gameModeRef = react.useRef(GameMode.ModeInit)

    // hold play time 
    const playTimeRef = react.useRef(0)

    gameModeRef.current = gameMode

    /*
        events
        1. get the mouse position
        2. rendering 3d model
        3. moving 3d model and hit event
    */
    react.useEffect(() => {
        // 1
        // define mouse moving 
        canvasRef.current.addEventListener('mousemove', function (e) {
            let mousePos: MousePos = getMousePosition(canvasRef.current, e)
            mousePositionXRef.current = (gameConfig.display_width / 2) - mousePos.x
        }, false)

        // fit mouse move to player move 
        const rate: number = Math.sqrt((gameConfig.camera_pos_y - gameConfig.player_position_y)**2 + gameConfig.camera_pos_z**2) / Math.sqrt(gameConfig.camera_pos_y**2 + (gameConfig.camera_pos_z - gameConfig.camera_lock_at_z)**2)
        const movement: number = gameConfig.field_width * 2 * rate / gameConfig.display_width

        // 2
        const renderer: Three.WebGLRenderer = new Three.WebGLRenderer({
            canvas: canvasRef.current,
        })
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(gameConfig.display_width, gameConfig.display_hight)

        // make scene
        const scene: Three.Scene = new Three.Scene()

        // make camera
        const camera: Three.PerspectiveCamera = new Three.PerspectiveCamera(gameConfig.camera_fov, gameConfig.display_width / gameConfig.display_hight, 0.1, 2000)
        camera.position.set(0, gameConfig.camera_pos_y, gameConfig.camera_pos_z)

        // make floor
        const floorGeometry: Three.BoxGeometry = new Three.BoxGeometry(gameConfig.field_width * 2, 400 ,100000)
        const floorMaterial: Three.MeshBasicMaterial = new Three.MeshBasicMaterial({color:0xFFFFFFFF})
        const floor: Three.Mesh = new Three.Mesh(floorGeometry, floorMaterial)
        floor.position.set(0, 0, -3000)
        scene.add(floor)

        // make player
        const playerGeometry: Three.SphereGeometry = new Three.SphereGeometry(gameConfig.player_half_size, 50, 50)
        const playerMaterial: Three.MeshToonMaterial = new Three.MeshToonMaterial({color: 'red'})
        const player: Three.Mesh = new Three.Mesh(playerGeometry, playerMaterial)
        player.position.set(0, gameConfig.player_position_y, 0)
        scene.add(player)

        // make horizontal light
        const directionalLight: Three.DirectionalLight = new Three.DirectionalLight('red')
        directionalLight.position.set(0, gameConfig.camera_pos_y + 100, 0)
        scene.add(directionalLight)

        // make enemy box
        let boxes: Array<Box> = []
        let enemy: Box
        for(let i = 0; i < 10; i++) {
            const lengthOfEdge: number = gameConfig.box_half_size * 2
            const boxGeometry: Three.BoxGeometry = new Three.BoxGeometry(lengthOfEdge, lengthOfEdge, lengthOfEdge)
            const boxMaterial: Three.MeshNormalMaterial = new Three.MeshNormalMaterial()
            const box: Three.Mesh = new Three.Mesh(boxGeometry, boxMaterial)
            box.position.set(generateRandomWidth(), gameConfig.player_position_y + gameConfig.box_half_size,gameConfig.box_initial_position_z)
            scene.add(box)
            enemy = {box: box, isMoving: false}
            boxes.push(enemy)
        }

        // 3
        let lastTime: number = performance.now()
        let startTime: number = lastTime

        // start loop events
        tick() 

        function tick() {
            // calc delta of movement
            const now: number = performance.now()
            const delta: number = (now - startTime) / 10
            lastTime = now 

            //player move 
            if(mousePositionXRef.current * movement <= (gameConfig.field_width - gameConfig.player_half_size) && mousePositionXRef.current * movement >= -(gameConfig.field_width - gameConfig.player_half_size)) {
                player.position.x = mousePositionXRef.current * movement
            }

            // enemy movement 
            boxes.map((box) => {
                if(!box.isMoving) {
                    if(Math.random() <= gameConfig.box_spawn_rate) {
                        box.isMoving = true 
                    }
                } 
                else {
                    if(box.box.position.z >= gameConfig.camera_pos_z) {
                        // check hit
                        if(box.box.position.x + gameConfig.box_half_size >= player.position.x + gameConfig.player_half_size - gameConfig.hit_box_margin && box.box.position.x - gameConfig.box_half_size <= player.position.x - gameConfig.player_half_size + gameConfig.hit_box_margin) {
                            if(box.box.position.z + gameConfig.box_half_size >= gameConfig.player_half_size - gameConfig.hit_box_margin && box.box.position.z - gameConfig.box_half_size <= - gameConfig.player_half_size + gameConfig.hit_box_margin) {
                                console.log("hit!!!!!!!!!!!!!!!")
                                playTimeRef.current = Math.floor((now - startTime) / 100) / 10
                                setGameMode(GameMode.ModeQuit)
                            }
                        } 
                        box.box.position.z -= gameConfig.box_movement * delta
                        
                    }
                    else {
                        // reset box pos 
                        box.box.position.set(generateRandomWidth(), gameConfig.player_position_y + gameConfig.box_half_size,gameConfig.box_initial_position_z)
                        box.isMoving = false 
                    }
                }
            })

            camera.lookAt(new Three.Vector3(0, 0, gameConfig.camera_lock_at_z))
            
            renderer.render(scene, camera)

            if(gameModeRef.current === GameMode.ModeQuit) {
                return
            }

            // go next loop
            requestAnimationFrame(tick)
        }
    }, [])

    function getMousePosition(canvas: HTMLCanvasElement, e: HTMLElementEventMap['mousemove']): MousePos {
        const rect: DOMRect = canvas.getBoundingClientRect()
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    }

    /*
    ** generate random width 
    ** @return number
    */
   function generateRandomWidth(): number {
    return (Math.random() - 0.5) * (gameConfig.field_width)
   }

   return (
    <>
        {
            gameMode != GameMode.ModeQuit?
                <>
                    <canvas ref={canvasRef} />
                </>
            :
                <div style={{height:gameConfig.display_hight, width: gameConfig.display_width, textAlign: 'center'}}>
                    <p>Game Over!</p>
                    <p>{playTimeRef.current} sec</p>
                    <button onClick={()=> window.location.reload()}>Retry?</button>
                </div>
        }
    </>
   )
})
