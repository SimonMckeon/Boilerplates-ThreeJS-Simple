import { Clock, Color, PerspectiveCamera, Scene, WebGLRenderer } from "three"
import Stats from "three/examples/jsm/libs/stats.module"
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

        // Set up debug
        this.setDebug()
        this.setStats()

        // Set up basic scene
        this.setRenderer()
        this.scene = new Scene()
        this.setCamera()

        // Orbit controls
        this.setControls()

        // Loop
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
        this.debug = {
            active: window.location.hash === "#debug",
        }
        if (this.debug.active) {
            this.debug.ui = new GUI()
        }
    }

    setStats() {
        if (this.debug.active) {
            this.stats = new Stats()
            this.stats.showPanel(0)
            document.body.appendChild(this.stats.dom)
        }
    }

    setRenderer() {
        this.renderer = new WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        })
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
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

    setControls() {
        if (this.debug.active) {
            this.controls = new OrbitControls(this.camera, this.canvas)
            this.controls.enableDamping = true
        }
    }

    setClock() {
        this.clock = new Clock()
        this.elapsedTime = 0
    }

    update() {
        if (this.debug.active && this.stats) {
            this.stats.begin()
        }

        const elapsedTime = this.clock.getElapsedTime()
        const delta = elapsedTime - this.elapsedTime
        this.elapsedTime = elapsedTime

        if (this.controls) {
            this.controls.update()
        }

        this.renderer.render(this.scene, this.camera)

        if (this.debug.active && this.stats) {
            this.stats.end()
        }

        window.requestAnimationFrame(this.update.bind(this))
    }
}
