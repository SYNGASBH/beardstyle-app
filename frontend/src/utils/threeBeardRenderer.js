/**
 * Three.js Beard Renderer — WebGL Rendering Layer
 *
 * Replaces CSS 3D transforms with proper WebGL rendering.
 * Consumes FaceTransform data from faceTracker.js (unchanged).
 *
 * Architecture:
 *   faceTracker.js → FaceTransform data (pure numbers)
 *   threeBeardRenderer.js → WebGL scene (this file)
 *   ARBeardOverlay.js → React wrapper + HUD + tech lines
 *
 * Rendering pipeline:
 *   PerspectiveCamera at z=800 (matches CSS perspective(800px))
 *   → PlaneGeometry with beard texture (alpha-transparent)
 *   → Shadow PlaneGeometry with multiply blending
 *   → Transparent WebGL canvas overlaid on video
 */

import * as THREE from 'three';

// ── Shadow Texture Generator ─────────────────────────────────────────────

/**
 * Generate a radial gradient CanvasTexture for the skin-tone shadow.
 * Multiply blend: white = no effect, darker center = shadow.
 *
 * @param {{ r: number, g: number, b: number }} skinTone
 * @returns {THREE.CanvasTexture}
 */
function createShadowTexture(skinTone) {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const r = Math.max(0, skinTone.r - 40);
  const g = Math.max(0, skinTone.g - 40);
  const b = Math.max(0, skinTone.b - 40);

  const gradient = ctx.createRadialGradient(
    size / 2, size * 0.4, 0,       // center, slightly above middle
    size / 2, size * 0.4, size / 2  // edge radius
  );
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.30)`);
  gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.10)`);
  gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ── ThreeBeardRenderer Class ─────────────────────────────────────────────

export default class ThreeBeardRenderer {
  /**
   * @param {HTMLCanvasElement} glCanvas - The canvas element for WebGL output
   * @param {number} width  - Initial viewport width (pixels)
   * @param {number} height - Initial viewport height (pixels)
   */
  constructor(glCanvas, width, height) {
    this._disposed = false;
    this._width = width;
    this._height = height;

    // ── Renderer ──
    this.renderer = new THREE.WebGLRenderer({
      canvas: glCanvas,
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ── Scene ──
    this.scene = new THREE.Scene();

    // ── Camera ──
    // PerspectiveCamera at z=800 replicates CSS perspective(800px)
    const fov = 2 * Math.atan(height / 2 / 800) * (180 / Math.PI);
    this.camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 2000);
    this.camera.position.set(width / 2, height / 2, 800);
    this.camera.lookAt(width / 2, height / 2, 0);

    // ── Beard Mesh ──
    this.beardGeometry = new THREE.PlaneGeometry(1, 1);
    this.beardMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      depthTest: false,
      opacity: 0.88,
      side: THREE.DoubleSide,
    });
    this.beardMesh = new THREE.Mesh(this.beardGeometry, this.beardMaterial);
    this.beardMesh.renderOrder = 1;
    this.scene.add(this.beardMesh);

    // ── Shadow Mesh ──
    this.shadowGeometry = new THREE.PlaneGeometry(1, 1);
    this.shadowMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      depthTest: false,
      opacity: 1.0,
      // Multiply blending: finalColor = srcColor * dstColor
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.DstColorFactor,
      blendDst: THREE.ZeroFactor,
      side: THREE.DoubleSide,
    });
    this.shadowMesh = new THREE.Mesh(this.shadowGeometry, this.shadowMaterial);
    this.shadowMesh.renderOrder = 0;
    this.shadowMesh.visible = false;
    this.scene.add(this.shadowMesh);

    // ── Texture loader ──
    this.textureLoader = new THREE.TextureLoader();
    this._currentTextureSrc = null;
    this._currentTexture = null;
    this._shadowTexture = null;

    // ── Smoothing state ──
    this._targetPos = new THREE.Vector3();
    this._targetScale = new THREE.Vector3(1, 1, 1);
    this._targetEuler = new THREE.Euler(0, 0, 0, 'YXZ');
    this._targetQuat = new THREE.Quaternion();
    this._smoothPos = new THREE.Vector3();
    this._smoothQuat = new THREE.Quaternion();
    this._smoothScale = new THREE.Vector3(1, 1, 1);
    this._hasInitialPose = false;
  }

  // ── Public Methods ──────────────────────────────────────────────────────

  /**
   * Load a beard texture from URL. Disposes previous texture.
   * @param {string} src - Path to beard image (WebP/PNG with alpha)
   */
  loadBeardTexture(src) {
    if (this._disposed || src === this._currentTextureSrc) return;
    this._currentTextureSrc = src;

    this.textureLoader.load(
      src,
      (texture) => {
        if (this._disposed || src !== this._currentTextureSrc) {
          texture.dispose();
          return;
        }
        // Dispose old
        if (this._currentTexture) this._currentTexture.dispose();

        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        this._currentTexture = texture;
        this.beardMaterial.map = texture;
        this.beardMaterial.needsUpdate = true;
        this.beardMesh.visible = true;
      },
      undefined,
      (err) => {
        console.warn('[ThreeBeard] Failed to load texture:', src, err);
        this.beardMesh.visible = false;
      }
    );
  }

  /**
   * Update skin tone for shadow mesh.
   * @param {{ r: number, g: number, b: number }} skinTone
   */
  updateSkinTone(skinTone) {
    if (this._disposed || !skinTone) return;

    if (this._shadowTexture) this._shadowTexture.dispose();
    this._shadowTexture = createShadowTexture(skinTone);
    this.shadowMaterial.map = this._shadowTexture;
    this.shadowMaterial.needsUpdate = true;
    this.shadowMesh.visible = true;
  }

  /**
   * Set beard overlay opacity.
   * @param {number} opacity - 0 to 1
   */
  setOpacity(opacity) {
    this.beardMaterial.opacity = opacity;
  }

  /**
   * Show/hide the beard overlay.
   * @param {boolean} visible
   */
  setVisible(visible) {
    this.beardMesh.visible = visible && !!this._currentTexture;
    this.shadowMesh.visible = visible && !!this._shadowTexture;
  }

  /**
   * Resize the renderer and camera.
   * @param {number} width
   * @param {number} height
   */
  resize(width, height) {
    if (this._disposed || (width === this._width && height === this._height)) return;
    this._width = width;
    this._height = height;

    this.renderer.setSize(width, height, false);

    const fov = 2 * Math.atan(height / 2 / 800) * (180 / Math.PI);
    this.camera.fov = fov;
    this.camera.aspect = width / height;
    this.camera.position.set(width / 2, height / 2, 800);
    this.camera.lookAt(width / 2, height / 2, 0);
    this.camera.updateProjectionMatrix();
  }

  /**
   * Update beard and shadow transforms from FaceTransform data, then render.
   *
   * @param {FaceTransform} t - Transform data from faceTracker.js
   * @param {number} videoW - Video width in pixels
   * @param {number} videoH - Video height in pixels
   */
  update(t, videoW, videoH) {
    if (this._disposed || !t) {
      this.beardMesh.visible = false;
      this.shadowMesh.visible = false;
      this.renderer.render(this.scene, this.camera);
      return;
    }

    // Scale video coords → display coords
    const sx = this._width / videoW;
    const sy = this._height / videoH;

    // ── Beard mesh position + size ──
    const beardW = t.jawWidth * 1.4 * sx;
    const beardH = t.faceHeight * 0.75 * sy;
    const cx = t.centerX * sx;
    // Three.js Y is bottom-up, but our camera looks down +Y, so flip
    const cy = this._height - (t.centerY * sy);

    this._targetPos.set(cx, cy, 0);
    this._targetScale.set(beardW, beardH, 1);

    // ── Rotations ──
    // CSS: rotateZ(roll) rotateY(yaw) rotateX(pitch)
    // Three.js Euler 'ZYX' order = apply X first, then Y, then Z (same as CSS)
    const pitchRad = THREE.MathUtils.degToRad(t.pitch);
    const yawRad = THREE.MathUtils.degToRad(-t.yaw); // CSS Y rotation is mirrored vs Three.js
    const rollRad = THREE.MathUtils.degToRad(-t.roll);

    this._targetEuler.set(pitchRad, yawRad, rollRad, 'ZYX');
    this._targetQuat.setFromEuler(this._targetEuler);

    // ── Smoothing (lerp/slerp for jitter reduction) ──
    const lerpFactor = this._hasInitialPose ? 0.6 : 1.0;

    this._smoothPos.lerp(this._targetPos, lerpFactor);
    this._smoothQuat.slerp(this._targetQuat, lerpFactor);
    this._smoothScale.lerp(this._targetScale, lerpFactor);

    this._hasInitialPose = true;

    // ── Apply to beard mesh ──
    this.beardMesh.position.copy(this._smoothPos);
    this.beardMesh.quaternion.copy(this._smoothQuat);
    this.beardMesh.scale.copy(this._smoothScale);
    if (this._currentTexture) this.beardMesh.visible = true;

    // ── Apply to shadow mesh (offset down, slightly larger) ──
    if (this._shadowTexture) {
      this.shadowMesh.position.set(
        this._smoothPos.x,
        this._smoothPos.y - 4 * sy,
        -1 // slightly behind beard
      );
      this.shadowMesh.quaternion.copy(this._smoothQuat);
      this.shadowMesh.scale.set(
        this._smoothScale.x * 0.93,
        this._smoothScale.y * 0.87,
        1
      );
      this.shadowMesh.visible = true;
    }

    // ── Render ──
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Render a single frame without updating transforms.
   * Useful when face is lost but we want to keep last position visible briefly.
   */
  render() {
    if (!this._disposed) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  /**
   * Dispose all Three.js resources. Call on unmount.
   */
  dispose() {
    this._disposed = true;

    if (this._currentTexture) {
      this._currentTexture.dispose();
      this._currentTexture = null;
    }
    if (this._shadowTexture) {
      this._shadowTexture.dispose();
      this._shadowTexture = null;
    }

    this.beardGeometry.dispose();
    this.beardMaterial.dispose();
    this.shadowGeometry.dispose();
    this.shadowMaterial.dispose();

    this.renderer.dispose();
  }
}
