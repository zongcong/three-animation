// 导入 Tween.js 库
import * as TWEEN from 'tween';
import * as THREE from 'three';

// 创建一个欧拉角对象
const euler = new THREE.Euler(rotate.x, rotate.y, rotate.z, 'YXZ') // 你可以根据需要选择合适的旋转顺序（XYZ、YXZ、ZXY等）
// 创建一个四元数对象
const endQuaternion = new THREE.Quaternion()
// 将欧拉角转换为四元数
endQuaternion.setFromEuler(euler)
// 获取当前相机四元素
const startQuaternion = this.camera.quaternion.clone()

// 创建 Tween.js 动画
const duration = 1500 // 动画时长（毫秒）
const tween = new TWEEN.Tween({ t: 0 })
    .to({ t: 1 }, duration)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate( (object) => {
        console.log(object)
        // 在 Tween.js 动画的 onUpdate 回调中设置四元数
        const t = object.t
        const currentQuaternion = new THREE.Quaternion()
        // 核心：四元素需要使用球面线性插值，不然两个四元数之间切换旋转会有问题
        currentQuaternion.slerpQuaternions(startQuaternion, endQuaternion, t)
        this.camera.quaternion.copy(currentQuaternion)
        this.camera.updateProjectionMatrix() // 更新相机属性
    })
    .onComplete(() => {
        // 动画完成之后需要干的事情
    })
    .start()