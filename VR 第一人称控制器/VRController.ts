import { EventDispatcher,Vector2, Quaternion, Euler, Camera } from 'three';

export class VRController extends EventDispatcher {
    camera;
    domElement;
    enabled;
    rotateSpeed;
    sphericalDelta;
    onMouseMoveBound;
    targetQuaternion;
    updateRequested;
    dampingFactor;
    enableDamping;

    constructor(camera: Camera, domElement: HTMLElement) {
        super();
        // 相机对象
        this.camera = camera;
        // DOM 元素，用于监听鼠标事件
        this.domElement = domElement;
        // 控制器是否启用的标志
        this.enabled = true;
        this.updateRequested = false;
        // 旋转速度
        this.rotateSpeed = 1;
        // 当.enableDamping设置为true的时候，阻尼惯性有多大
        this.dampingFactor = 0.9;
        // 是否启用阻尼
        this.enableDamping = true;
        // 球面坐标的增量
        this.sphericalDelta = new Vector2();
        // 鼠标移动事件处理函数的绑定，确保函数内部的 this 指向当前实例
        this.onMouseMoveBound = this.onMouseMove.bind(this);
        // 目标四元数，用于保存相机初始的旋转状态
        this.targetQuaternion = new Quaternion().copy(this.camera.quaternion);
        // 监听鼠标事件
        this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.domElement.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.domElement.addEventListener('mouseleave', this.onMouseUp.bind(this));
    }

    setEnabled(value: boolean) {
        this.enabled = value;
    }

    getEnabled() {
        return this.enabled;
    }

    onMouseDown(event: Event) {
        if (!this.getEnabled()) return;
        event.preventDefault();
        this.domElement.style.cursor = 'grab';
        this.domElement.addEventListener('mousemove', this.onMouseMoveBound);
    }

    onMouseUp(event: Event) {
        if (!this.getEnabled()) return;
        event.preventDefault();
        this.domElement.style.cursor = 'auto';
        this.domElement.removeEventListener('mousemove', this.onMouseMoveBound);
    }

    onMouseMove(event: any) {
        if (!this.getEnabled()) return;
        event.preventDefault();

        const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        // 减小旋转速度
        this.sphericalDelta.x -= movementX * 0.004 * this.rotateSpeed * this.dampingFactor;
        this.sphericalDelta.y -= movementY * 0.004 * this.rotateSpeed * this.dampingFactor;

        // 请求下一帧执行旋转更新
        if (!this.updateRequested) {
            this.updateRequested = true;
            requestAnimationFrame(this.update.bind(this));
        }
    }


    update() {
        if (!this.getEnabled()) return;

        const euler = new Euler(0, 0, 0, 'YXZ');
        euler.setFromQuaternion(this.camera.quaternion);

        // 减小旋转速度
        this.sphericalDelta.x *= this.dampingFactor;
        this.sphericalDelta.y *= this.dampingFactor;

        euler.y += this.sphericalDelta.x;
        euler.x += this.sphericalDelta.y;

        euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));

        this.camera.quaternion.setFromEuler(euler);
        this.dispatchEvent({ type: 'change' });

        // 允许下一次的更新请求
        this.updateRequested = false;
    }

}
