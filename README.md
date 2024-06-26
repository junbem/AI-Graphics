# AI-Graphics

![스크린샷 2024-04-01 161500](https://github.com/junbem/AI-Graphics/assets/50951220/9829ce7b-094a-49e8-8fc5-75b2f3b2c5b1)

## 소감문

app 클래스로 constructor 메서드에서 WebGL 렌더러, 씬, 카메라, 조명 및 모델을 초기화 하고 리싸이징 및 렌더링을 담당하는 메서드를 정의했습니다. 
setupCamera 메서드에선 시야각, 종횡비를 설정하고 초기 위치를 지정했습니다. 
setupLight 메서드에서는 조명을 설정해서 방향성 광원으로 생성하고 태양을 만들었습니다. 
setupModel 메서드에서는 태양, 지구, 달을 생성하고 배치했습니다
resize에서는 창 크기 조정에 대응하여 카메라 종횡비를 업데이트하고 렌더러 크기를 조정했습니다.
render 메서드는 애니메이션 프레임마다 렌더링을 수행하고 update 메서드를 호출하여 모델 회전을 시킵니다.
update 메서드를 통해 애니메이션 업데이트를 해서 태양계를 표현했습니다.

태양계 모델을 만들면서 Three.js의 강력함을 체험했습니다. 3D 공간에서 태양, 지구, 달 등의 객체를 만들고 배치하는 과정이 흥미로웠습니다. 코드의 간결함과 직관성 덕분에 쉽게 이해할 수 있었습니다. 모델을 회전시켜 보면서 실제 태양계의 운동을 시각적으로 확인할 수 있어서 재미있었습니다. Three.js를 사용하면 다양한 3D 프로젝트를 쉽고 빠르게 구현할 수 있을 것 같아 기대됩니다.
