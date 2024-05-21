### 1.
## 1) p5.js의 특징
간편한 사용성: p5.js는 자바스크립트 기반의 라이브러리로, 그래픽 및 인터랙티브 아트를 쉽게 생성할 수 있습니다.
웹 기반: 웹 브라우저에서 실행되며, 다양한 디바이스에서 작동하는데 용이합니다.
시각화 도구: 데이터 시각화부터 예술적 표현까지 다양한 그래픽 작업을 지원합니다.
다양한 기능 제공: 도형 그리기, 색상 조작, 애니메이션 등 다양한 기능을 제공하여 창의적인 작업을 할 수 있습니다.
사용자 친화적: 간단한 API와 풍부한 예제들이 제공되어, 프로그래밍 경험이 적은 사람도 쉽게 접근할 수 있습니다.

## 2) 인터랙티브 아트의 개념
사용자 참여: 인터랙티브 아트는 관람자의 참여와 상호작용을 강조합니다. 이를 통해 작품은 동적이고 변화하는 경험을 제공합니다.
실시간 반응: 관객의 행동에 따라 작품이 실시간으로 반응하며, 이는 작품의 경험을 더욱 풍부하게 만듭니다.
다양한 매체 활용: 인터랙티브 아트는 컴퓨터 기술과 다양한 매체를 결합하여 창의적으로 표현됩니다.
체험 중심: 단순히 관람하는 것을 넘어서, 관객은 작품을 탐구하고 발견하며, 이를 통해 새로운 인사이트를 얻을 수 있습니다.
융합성: 예술, 공학, 과학 등 다양한 분야의 지식과 기술이 융합되어 새로운 형태의 작품을 만들어냅니다.

## 3) 예제 코드 작성 및 설명
function setup() {
createCanvas(400, 400); // 캔버스 생성
  background(225);// 배경색 설정
}

function draw() {
// 배경 색상 설정
fill(255, 0, 0); // 원의 색상 설정 (빨강)
ellipse(mouseX, mouseY, 50, 50); // 마우스 위치에 원 그리기
}

![스크린샷 2024-05-21 154048](https://github.com/junbem/AI-Graphics/assets/50951220/9a9b6bed-7399-4a29-b9ce-994cf8464f36)

### 2.
## 1) ml5.js의 기능과 장점 설명
간편한 사용법: ml5.js는 머신러닝 모델을 쉽게 웹 애플리케이션에 통합할 수 있도록 지원합니다.
사전 훈련된 모델 제공: 이미 구축된 모델을 제공하여 개발자가 쉽게 활용할 수 있습니다.
다양한 머신러닝 작업 지원: 이미지 분류, 객체 감지, 생성적 모델 등 다양한 머신러닝 작업을 지원합니다.
웹 기반 실행: 웹 브라우저에서 실행되므로 별도의 설치 없이 사용할 수 있습니다.
커뮤니티와 지원: 활발한 개발자 커뮤니티와 풍부한 문서화를 통해 지속적인 지원이 제공됩니다.

## 2) 이미지 분류 모델 구현 과정 서술
데이터 수집 및 전처리: 이미지 데이터를 수집하고, 라벨링하여 모델이 학습할 수 있도록 전처리합니다.
모델 선택 및 불러오기: ml5.js에서 제공하는 사전 훈련된 이미지 분류 모델을 선택하고 불러옵니다.
모델 학습: 불러온 모델을 훈련 데이터로 학습시킵니다.
모델 평가: 학습된 모델을 테스트 데이터에 대해 평가하고 성능을 확인합니다.
웹 애플리케이션에 통합: 학습된 모델을 웹 애플리케이션에 통합하여 사용자에게 제공합니다.

## 3) 이미지 분류 모델의 원리 설명:
특징 추출: 이미지에서 특징을 추출하여 숫자로 변환합니다. 이는 픽셀 값, 텍스처, 모양 등을 포함합니다.
특징 벡터 생성: 추출된 특징을 벡터로 변환하여 모델이 이해할 수 있는 형태로 만듭니다.
모델 학습: 특징 벡터를 기반으로 머신러닝 알고리즘이 학습하여 이미지의 클래스를 예측할 수 있는 모델을 생성합니다.
예측: 새로운 이미지에 대해 학습된 모델을 사용하여 해당 이미지의 클래스를 예측합니다.

### 3.
## 1) three.js의 주요 구성 요소 설명
Scene(장면): 모든 3D 객체가 배치되는 공간을 정의합니다.
Renderer(렌더러): 3D 장면을 화면에 그리는 역할을 합니다.
Camera(카메라): 장면을 보는 시점을 결정하며, 화면에 어떻게 투영될지를 제어합니다.
Geometry(기하학): 객체의 형상을 정의하는 데이터 구조입니다.
Material(재질): 객체의 표면 특성을 정의하고 색상, 질감 등을 설정합니다.

## 2) 3D 장면 구성 과정 설명
장면 생성: Scene 객체를 생성하여 3D 공간을 정의합니다.
카메라 설정: 원하는 시점과 시야를 가진 Camera를 생성하고 설정합니다.
렌더러 생성: 화면에 그리기 위한 Renderer를 생성하고 웹 페이지에 추가합니다.
기하학과 재질 설정: Geometry와 Material을 결합하여 3D 객체를 생성하고 표현합니다.
객체 추가: 장면에 생성한 객체를 추가하여 전체 3D 장면을 구성합니다.

## 3) 예제 코드 작성 및 설명
# 01-basic.css 
* {
    outline: none;
    margin: 0;
}

body {
    overflow: hidden;
}

#webgl-container {
    position: absolute;
    top : 0;
    left: 0;
    width: 100%;
    height: 100%;
}

# 01-basic.html
<!DOCTYPE html>
<html>
    <head>
        <meta value="viewport" content="width=device-width, inital-scale=1">
        <link rel="stylesheet" href="01-basic.css">
        <script type="importmap">
			{
				"imports": {
					"three": "../build/three.module.js",
					"three/addons/": "./jsm/"
				}
			}
		</script>
        <script type="module" src="01-basic.js" defer></script>
    </head>
    <body>
        <div id="webgl-container"></div>
    </body>
</html>

# 01-basic.js
import * as THREE from '../build/three.module.js';

class App {
    constructor() {
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

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));

        // 색상 변경 타이머 설정
        this.colorChangeInterval = 3; // 3초마다 색상 변경
        this.lastColorChangeTime = 0;
    }

    _setupCamera() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            100
        );
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
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({color: 0x44a88});

        const cube = new THREE.Mesh(geometry, material);
        this._scene.add(cube);
        this._cube = cube;
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
        time *= 0.001;
        this._cube.rotation.x = time;
        this._cube.rotation.y = time;

        // 3초마다 색상 변경
        if (time - this.lastColorChangeTime > this.colorChangeInterval) {
            const randomColor = Math.random() * 0xffffff;
            this._cube.material.color.set(randomColor);
            this.lastColorChangeTime = time;
        }
    }
}

window.onload = function() {
    new App()
}


