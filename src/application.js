import { BoxBufferGeometry, Clock, Color, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GUI } from "dat.gui"

export default class Application {
    constructor(canvasElement) {
        this.canvas = canvasElement

        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight,
        }
        window.addEventListener("resize", this.onResize.bind(this), false)

        // Set up dat.gui debug panels
        this.setDebug()
        
        // Set up basic scene
        this.setRenderer()
        this.scene = new Scene()
        this.setCamera()
        this.setControls()

        // Set up demo cube
        this.cube = new Mesh(
            new BoxBufferGeometry(1, 1, 1),
            new MeshBasicMaterial({ color: 0xffffff })
        )
        this.scene.add(this.cube)

        this.setClock()
        this.update()
    }

    onResize() {
        this.sizes.width = window.innerWidth
        this.sizes.height = window.innerHeight
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    setDebug() {
        // We only want to show the debug panel if the #debug hash is included
        // in the URL. I like to leave this on in production because sharing is caring
        this.debug = {
            active: window.location.hash === "#debug",
        }
        if (this.debug.active) {
            this.debug.ui = new GUI()
        }
    }

    setCamera() {
        this.camera = new PerspectiveCamera(
            75,
            this.sizes.width / this.sizes.height,
            0.1,
            100
        )
        this.camera.position.set(0, 0, 2)
        this.scene.add(this.camera)
    }

    setRenderer() {
        this.renderer = new WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        })
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        if (this.debug.active) {
            // We can't update the color values in threeJS directly as it needs to be a THREE.Color class instance.
            // We create a dummy config that is simply used for dat.gui to have something to attach to, but we update
            // the actual color in the onChange callback to a new THREE.Color instance.
            // This will be done a lot as you're building out debug UIs, so this is just here to serve as an example :)
            const params = { clearColor: 0x000000 }
            const folder = this.debug.ui.addFolder("Renderer")
            folder.addColor(params, "clearColor").onChange(() => {
                this.renderer.setClearColor(new Color(params.clearColor))
            })
        }
    }

    setClock() {
        this.clock = new Clock()
        this.elapsedTime = 0
    }

    setControls() {
        this.controls = new OrbitControls(this.camera, this.canvas)
        this.controls.enableDamping = true
    }

    update() {
        const elapsedTime = this.clock.getElapsedTime()
        const delta = elapsedTime - this.elapsedTime
        this.elapsedTime = elapsedTime

        // Rotate our cube
        this.cube.rotation.y += delta * 1

        // Update orbit controls
        this.controls.update()

        this.renderer.render(this.scene, this.camera)

        window.requestAnimationFrame(this.update.bind(this))
    }
}
