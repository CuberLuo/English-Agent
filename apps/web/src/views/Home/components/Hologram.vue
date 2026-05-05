<template>
  <canvas ref="hologramRef"></canvas>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js' //gltf模型加载器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js' //轨道控制器
import { useTemplateRef, onMounted } from 'vue'
const hologramRef = useTemplateRef<HTMLCanvasElement>('hologramRef')
const initThree = () => {
  //创建场景 -> 网格(几何 + 材质) + 相机 + 渲染器 + 灯光(可选的)
  //创建场景 -> 模型obj gltf ... + 相机 + 渲染器 + 灯光(可选的)
  const scene = new THREE.Scene()
  //动画混合器
  let mixer: THREE.AnimationMixer | null = null
  const clock = new THREE.Clock() //创建时钟
  const render_width = 300
  const render_height = 300
  //创建相机
  const camera = new THREE.PerspectiveCamera(
    45,
    render_width / render_height,
    0.1,
    1000,
  )
  camera.position.set(10, 0, 0)
  const loader = new GLTFLoader() //创建模型加载器

  loader.load('/models/robot/scene.gltf', (gltf) => {
    scene.add(gltf.scene) //添加模型到场景
    gltf.scene.scale.set(2.5, 2.5, 2.5) //缩放模型
    gltf.scene.position.y = -5.8
    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(gltf.scene)
      gltf.animations.forEach((clip) => {
        const action = mixer!.clipAction(clip)
        action.play()
      })
    }
  })
  //环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 1)
  scene.add(ambientLight)
  //平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
  directionalLight.position.set(5, 10, 7.5)
  scene.add(directionalLight)
  //创建渲染器
  const renderer = new THREE.WebGLRenderer({
    canvas: hologramRef.value!,
    antialias: true, //抗锯齿
    alpha: true, //透明背景
    precision: 'highp', //高精度
    powerPreference: 'high-performance', //高性能
  })
  renderer.setSize(render_width, render_height) //设置渲染器大小
  const controls = new OrbitControls(camera, renderer.domElement) //创建轨道控制器
  controls.enableRotate = false //禁用旋转
  controls.enableZoom = false //禁用缩放

  // 鼠标跟踪变量
  let mouseX = 0
  let mouseY = 0
  const windowHalfX = window.innerWidth / 2
  const windowHalfY = window.innerHeight / 2

  // 监听鼠标移动
  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) / windowHalfX
    mouseY = (event.clientY - windowHalfY) / windowHalfY
  })

  const animate = () => {
    requestAnimationFrame(animate)
    const delta = clock.getDelta() //1 - 2
    if (mixer) {
      mixer.update(delta) //更新动画混合器
    }

    // 模型小范围跟随鼠标
    scene.rotation.y += (mouseX * 0.8 - scene.rotation.y) * 0.05
    scene.rotation.z += (-mouseY * 0.3 - scene.rotation.z) * 0.05
    renderer.render(scene, camera)
  }
  animate()
}
onMounted(() => {
  initThree()
})
</script>
