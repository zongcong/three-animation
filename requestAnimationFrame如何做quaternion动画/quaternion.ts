// 导入 Tween.js 库
import * as TWEEN from 'tween.js';
import * as THREE from 'three';


// 创建一个 Three.js 中的 PerspectiveCamera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

// 创建一个 Three.js 的场景和渲染器
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建一个立方体对象
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 初始四元数
const initialQuaternion = new THREE.Quaternion();
cube.quaternion.copy(initialQuaternion);

// 目标四元数
const targetQuaternion = new THREE.Quaternion();
targetQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI); // 旋转180度

// 创建 Tween.js 动画
const duration = 2000; // 动画时长（毫秒）
const tween = new TWEEN.Tween({ t: 0 })
    .to({ t: 1 }, duration)
    .onUpdate(function () {
        // 在 Tween.js 动画的 onUpdate 回调中设置四元数
        const t = this.t;
        const currentQuaternion = new THREE.Quaternion();
        // 核心：四元素需要使用球面线性插值，不然两个四元数之间切换旋转会有问题
        currentQuaternion.slerpQuaternions(initialQuaternion, targetQuaternion, t);
        cube.quaternion.copy(currentQuaternion);
    })
    .start();

// 渲染场景
function animate() {
    requestAnimationFrame(animate);
    TWEEN.update(); // 更新 Tween.js 动画
    renderer.render(scene, camera);
}
animate();
