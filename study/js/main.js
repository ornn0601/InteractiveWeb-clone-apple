// 익명함수의 즉시실행 함수
// 전역변수 사용을 피하기 위해 사용한다.
// (function () {})();
(() => {

  let yOffset = 0; // window.pageYOffset 대신 쓸 변수
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이의 합
  let currentScene = 0; // 현재 활성화된(눈 앞에 보고 있는) 씬(scroll-seciton)
  let enterNewScene = false; // 새로운 scene이 시작되는 순간 true

  // 애니메이션에 대한 정보를 배열, 객체에 담는다.
  // 스크롤 높이 정보(애니메이션 구간)를 정의한다.
  const sceneInfo = [
    {
      // index: 0
      type: 'sticky', // 고정화면과 일반화면을 구분한다.
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0, // 사용자 창 사이즈 대응을 위해 초기 값으로 설정
      objs: { // html 객체 모음
        container: document.querySelector('#scroll-section-0'),
        messageA: document.querySelector('#scroll-section-0 .main-message.a'),
        messageB: document.querySelector('#scroll-section-0 .main-message.b'),
        messageC: document.querySelector('#scroll-section-0 .main-message.c'),
        messageD: document.querySelector('#scroll-section-0 .main-message.d'),
        canvas: document.querySelector('#video-canvas-0'),
        context: document.querySelector('#video-canvas-0').getContext('2d'),
        videoImages: []
      },
      values: { // 변화를 줄 요소에 적용될 내용
        videoImageCount: 300,
        imageSequence: [0, 299],
        messageA_opacity_in: [0, 1, {start: 0.1, end: 0.2}], // 시작값, 끝값 (%)
        messageB_opacity_in: [0, 1, {start: 0.3, end: 0.4}],
        messageC_opacity_in: [0, 1, {start: 0.5, end: 0.6}],
        messageD_opacity_in: [0, 1, {start: 0.7, end: 0.8}],

        messageA_translateY_in: [20, 0, {start: 0.1, end: 0.2}],
        messageB_translateY_in: [20, 0, {start: 0.3, end: 0.4}],
        messageC_translateY_in: [20, 0, {start: 0.5, end: 0.6}],
        messageD_translateY_in: [20, 0, {start: 0.7, end: 0.8}],

        messageA_opacity_out: [1, 0, {start: 0.25, end: 0.3}],
        messageB_opacity_out: [1, 0, {start: 0.45, end: 0.5}],
        messageC_opacity_out: [1, 0, {start: 0.65, end: 0.7}],
        messageD_opacity_out: [1, 0, {start: 0.85, end: 0.9}],

        messageA_translateY_out: [0, -20, {start: 0.25, end: 0.3}],
        messageB_translateY_out: [0, -20, {start: 0.45, end: 0.5}],
        messageC_translateY_out: [0, -20, {start: 0.65, end: 0.7}],
        messageD_translateY_out: [0, -20, {start: 0.85, end: 0.9}],
      }
    },
    {
      // index: 1
      type: 'normal',
      // heightNum: 5, // type normal에서는 필요 없음
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-1')
      }
    },
    {
      // index: 2
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-2'),
        messageA: document.querySelector('#scroll-section-2 .a'),
        messageB: document.querySelector('#scroll-section-2 .b'),
        messageC: document.querySelector('#scroll-section-2 .c'),
        pinB: document.querySelector('#scroll-section-2 .b .pin'),
        pinC: document.querySelector('#scroll-section-2 .c .pin')
      },
      values: {
        messageA_translateY_in: [20, 0, {start: 0.15, end: 0.2}],
        messageB_translateY_in: [30, 0, {start: 0.5, end: 0.55}],
        messageC_translateY_in: [30, 0, {start: 0.72, end: 0.77}],

        messageA_opacity_in: [0, 1, {start: 0.15, end: 0.2}],
        messageB_opacity_in: [0, 1, {start: 0.5, end: 0.55}],
        messageC_opacity_in: [0, 1, {start: 0.72, end: 0.77}],

        messageA_translateY_out: [0, -20, {start: 0.3, end: 0.35}],
        messageB_translateY_out: [0, -20, {start: 0.58, end: 0.63}],
        messageC_translateY_out: [0, -20, {start: 0.85, end: 0.9}],

        messageA_opacity_out: [1, 0, {start: 0.3, end: 0.35}],
        messageB_opacity_out: [1, 0, {start: 0.58, end: 0.63}],
        messageC_opacity_out: [1, 0, {start: 0.85, end: 0.9}],

        pinB_scaleY: [0.5, 1, {start: 0.5, end: 0.55}],
        pinC_scaleY: [0.5, 1, {start: 0.72, end: 0.77}],

        pibB_opacity_in: [0, 1, {start: 0.5, end: 0.55}],
        pibC_opacity_in: [0, 1, {start: 0.72, end: 0.77}],
        
        pibB_opacity_out: [1, 0, {start: 0.58, end: 0.63}],
        pibC_opacity_out: [1, 0, {start: 0.85, end: 0.9}],
      }
    },
    {
      // index: 3
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-3'),
        canvasCaption: document.querySelector('.canvas-caption')
      },
      values: {

      }
    }
  ];

  function setCanvasImage() {
    let imgElem;
    for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
      imgElem = new Image();
      imgElem.src = `./video/001/IMG_${6726 + i}.jpg`;
      sceneInfo[0].objs.videoImages.push(imgElem);
    }
  }
  setCanvasImage();


  // 레이아웃 초기화
  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === 'sticky') {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else if (sceneInfo[i].type === 'normal') {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
      }
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    yOffset = window.pageYOffset;
    let totalScrollheight = 0;
    for (let i = 0; sceneInfo.length; i++) {
      totalScrollheight += sceneInfo[i].scrollHeight;
      if (totalScrollheight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    document.body.setAttribute('id', `show-scene-${currentScene}`);
  }

  function calcValues(values, currentYOffset) {
    let rv;

    // 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    if (values.length === 3) {
      // start ~ end 사이에 애니메이션 실행 (뒤 - 앞 / 전체)
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
      rv =  (currentYOffset - partScrollStart) /partScrollHeight * (values[1] - values[0]) + values[0];
      } else if (currentYOffset < partScrollStart) {
        rv = values[0];
      } else if (currentYOffset > partScrollEnd) {
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return rv;
  }

  // 애니메이션
  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight; // 현재 씬의 scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    // console.log(currentScene);

    switch (currentScene) {
      case 0:
        if (scrollRatio <= 0.22) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.42) {
					// in
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.62) {
					// in
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.82) {
					// in
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
				}
        break;

      case 2:

				if (scrollRatio <= 0.25) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.57) {
					// in
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
				} else {
					// out
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
				}

				if (scrollRatio <= 0.83) {
					// in
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
				} else {
					// out
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
				}
        break;

      case 3:
        
        break;
    }
  }

  function scrollLoop() {
    enterNewScene = false;
    prevScrollHeight = 0; // 높이 초기화
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    if (yOffset < prevScrollHeight) {
      enterNewScene = true;
      if (currentScene === 0) return; // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
      currentScene--;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    if (enterNewScene) return;

    playAnimation();
  }

  // 이벤트 적용
  window.addEventListener('resize', setLayout);
  window.addEventListener('scroll', ()=> { // 함수들을 호출한다.
    yOffset = window.pageYOffset; // 직관적으로 보이게
    scrollLoop();
  })
  // 웹페이지에 있는 모든 리소스(이미지 포함)를 로드하고 실행
  window.addEventListener('load', setLayout);
  // DOMContent 리소스를 로드하고 실행 (load보다 좀 더 빠름)
  // window.addEventListener('DOMContentLoaded', setLayout);
  window.addEventListener('resize', setLayout);

})();
