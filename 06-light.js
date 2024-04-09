// 05-custom-geometry.js
import * as THREE from '../build/three.module.js';
import {OrbitControls} from '../examples/jsm/controls/OrbitControls.js';
import {VertexNormalsHelper} from '../examples/jsm/helpers/VertexNormalsHelper.js';

class App {
   constructor() {
      const divContainer = document.querySelector('#webgl-container');
      this._divContainer = divContainer;

      const renderer = new THREE.WebGLRenderer({antialias: true});
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

   _setupControls() {
      new OrbitControls(this._camera, this._divContainer);
   }

   _setupCamera() {
      const width = this._divContainer.clientWidth;
      const height = this._divContainer.clientHeight;
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
      camera.position.z = 2;
      this._camera = camera;
   }

   _setupLight() {
      const color = 0xffffff;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      this._scene.add(light);
   }

   _setupModel() {
      const rawPositions = [
         -1, -1, 0,
         1, -1, 0,
         -1, 1, 0,
         1, 1, 0,
      ];

      // 법선 배열에 대한 배열 데이터
      const rawNormals = [
         0, 0, 1, // mesh의 면으로 봤을 때 면에 대한 수직인 벡터 0,0,1
         0, 0, 1,
         0, 0, 1,
         0, 0, 1,
      ];

      // 정점에 대한 색상값 지정
      const rawColors = [
         1, 0, 0,
         0, 1, 0,
         0, 0, 1,
         1, 1, 0,
      ];

      // 텍스쳐 맵핑
      const rawUvs = [
         0, 0, // 이미지의 좌측 하단 위치로 geometry의 정점 좌표 (-1, -1, 0)에 맵핑
         1, 0,
         0, 1,
         1, 1,
      ];

      const positions = new Float32Array(rawPositions);
      const normals = new Float32Array(rawNormals);
      const colors = new Float32Array(rawColors);
      const uvs = new Float32Array(rawUvs);

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

      // 법선 벡터를 자동으로 계산해주는 메서드 대신 rawNormals 로 직접 지정해주었다.
      //geometry.computeVertexNormals();

      // vertax index 는 삼각형 면을 정의함. 사각형은 두 개의 삼각형으로 이루어져 있다.
      geometry.setIndex([
         0, 1, 2,
         2, 1, 3,
      ]);
      
      const textureLoader = new THREE.TextureLoader();
      const map = textureLoader.load('../examples/textures/uv_grid_opengl.jpg');

      // vertexColor : 각 버텍스에 지정된 색상대로 mesh를 표현할것인지에 대한 여부
      const material = new THREE.MeshPhongMaterial({
         color: 0xffffff,
         vertexColors: true,
         map: map,
      });

      const box = new THREE.Mesh(geometry, material);
      this._scene.add(box);

      const helper = new VertexNormalsHelper(box, 0.1, 0xffff00);
      this._scene.add(helper);
   }

   resize() {
      const width = this._divContainer.clientWidth;
      const height = this._divContainer.clientHeight;

      this._camera.aspect = width / height;
      this._camera.updateProjectionMatrix();

      this._renderer.setSize(width, height);
   }

   render(time) {
      this._renderer.render(this._scene, this._camera);
      this.update(time);
      requestAnimationFrame(this.render.bind(this));
   }

   update(time) {
      time *= 0.001; // second unit
   }
}

window.onload = function() {
   new App();
}