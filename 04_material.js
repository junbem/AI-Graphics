import * as THREE from 'three';
import { OrbitControls }  from '../examples/jsm/controls/OrbitControls.js'
import { VertexNormalsHelper } from "../examples/jsm/helpers/VertexNormalsHelper.js"

class App{
    constructor(){
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGL1Renderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;

        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));

    }
    _setupControls(){
        new OrbitControls(this._camera, this._divContainer);
    }
    _setupCamera(){
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        camera.position.z = 3;
        this._camera = camera;    
        this._scene.add(camera);
    }
    _setupLight(){
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this._scene.add(ambientLight);

        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        //this._scene.add(light);
        this._camera.add(light);
    }
    _setupModel(){
        const textureLoader = new THREE.TextureLoader();
        const map = textureLoader.load("images/glass/Glass_Window_002_basecolor.jpg");
        const mapAO = textureLoader.load("images/glass/Glass_Window_002_ambientOcclusion.jpg");
        const mapHeight = textureLoader.load("images/glass/Glass_Window_002_height.png");
        const mapNormal = textureLoader.load("images/glass/Glass_Window_002_normal.jpg");
        const mapRoughness = textureLoader.load("images/glass/Glass_Window_002_roughness.jpg");
        const mapMetalic = textureLoader.load("images/glass/Glass_Window_002_metallic.jpg");
        const mapAlpha = textureLoader.load("images/glass/Glass_Window_002_opacity.jpg");
        const mapLight = textureLoader.load("images/glass/light.jpg");
        const material = new THREE.MeshStandardMaterial({
            map: map,
            normalMap: mapNormal,

            displacementMap: mapHeight,
            displacementScale: 0.2,
            displacementBias: -0.15,

            aoMap: mapAO,
            aoMapIntensity: 1,

            roughnessMap: mapRoughness,
            roughness: 0.5,

            metalnessMap: mapMetalic,
            metalness: 0.5,

            //alphaMap: mapAlpha,
            transparent: true,
            side: THREE.DoubleSide,

            lightMap: mapLight,
            lightMapIntensity: 2,
        });

        const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 256, 256, 256), material);
        box.position.set(-1, 0, 0);
        box.geometry.attributes.uv2 = box.geometry.attributes.uv;
        this._scene.add(box);

        

        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 512, 512), material);
        sphere.position.set(1, 0, 0);
        sphere.geometry.attributes.uv2 = sphere.geometry.attributes.uv;
        this._scene.add(sphere);

        
    }
    resize(){
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }
    render(time){
        this._renderer.render(this._scene, this._camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }
    update(time){
        time *= 0.001;
        
    }
}

window.onload = function(){
    new App()
}