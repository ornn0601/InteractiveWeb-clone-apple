// 익명함수의 즉시실행 함수
// 전역변수 사용을 피하기 위해 사용한다.
// (function () {})();
(() => {

  let yOffset = 0; // window.pageYOffset 대신 쓸 변수
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이의 합
  let currentScene = 0; // 현재 활성화된(눈 앞에 보고 있는) 씬(scroll-seciton)

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
      },
      values: { // 변화를 줄 요소에 적용될 내용
        messageA_opacity: [0, 1], // 시작값, 끝값
      }
    },
    {
      // index: 1
      type: 'normal',
      heightNum: 5,
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
        container: document.querySelector('#scroll-section-2')
      }
    },
    {
      // index: 3
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-3')
      }
    }
  ];

  // 레이아웃 초기화
  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
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
    let scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;
    rv = scrollRatio * (values[1] - values[0]) + values[0];

    return rv;
  }

  // 애니메이션
  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;

    switch (currentScene) {
      case 0:
        let messageA_opacity_in = calcValues(values.messageA_opacity, currentYOffset);
        objs.messageA.style.opacity = messageA_opacity_in;
        console.log(messageA_opacity_in);

        break;
      case 1:

        break;

      case 2:

        break;

      case 3:
        
        break;
    }
  }

  function scrollLoop() {
    prevScrollHeight = 0; // 높이 초기화
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      currentScene++;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    if (yOffset < prevScrollHeight) {
      if (currentScene === 0) return; // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
      currentScene--;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    playAnimation();
  }

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
