import React, { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

/**
 * AnimatedWave
 * A 3D interactive wave background using Three.js and Simplex Noise.
 */
const AnimatedWave = ({
    className = '',
    speed = 0.015,
    amplitude = 30,
    smoothness = 300,
    wireframe = true,
    waveColor,
    opacity = 1,
    mouseInteraction = true,
    quality = 'medium',
    fov = 60,
    waveOffsetY = -300,
    waveRotation = 29.8,
    cameraDistance = -1000,
    autoDetectBackground = true,
    backgroundColor = 'transparent',
    ease = 12,
    mouseDistortionStrength = 0.5,
    mouseDistortionSmoothness = 100,
    mouseDistortionDecay = 0.0005,
    mouseShrinkScaleStrength = 0.7,
    mouseShrinkScaleRadius = 200,
}) => {
    const containerRef = useRef(null);
    const sceneElementsRef = useRef({
        scene: null,
        camera: null,
        renderer: null,
        groundPlain: null,
        animationFrameId: null,
        mouse: { x: 0, y: 0 },
    });

    const [webGLFailed, setWebGLFailed] = useState(false);

    const getQualitySettings = useCallback((quality) => {
        switch (quality) {
            case 'low': return { width: 64, height: 32 };
            case 'high': return { width: 256, height: 128 };
            default: return { width: 128, height: 64 };
        }
    }, []);

    const determineWaveColor = useCallback(() => {
        if (waveColor) return new THREE.Color(waveColor);

        if (autoDetectBackground && containerRef.current) {
            // Fallback for dark mode (white wave) vs light mode (black or primary)
            const isDarkMode = document.documentElement.classList.contains('dark');
            return isDarkMode ? new THREE.Color(0x6366F1) : new THREE.Color(0x4F46E5);
        }
        return new THREE.Color(0x6366F1);
    }, [waveColor, autoDetectBackground]);

    const createGroundPlain = useCallback(() => {
        const { width: geometryWidth, height: geometryHeight } = getQualitySettings(quality);

        const groundPlain = {
            group: null,
            geometry: null,
            material: null,
            plane: null,
            simplex: null,
            factor: smoothness,
            scale: amplitude,
            speed: speed,
            cycle: 0,
            ease: ease,
            move: new THREE.Vector3(0, waveOffsetY, cameraDistance),
            look: new THREE.Vector3((waveRotation * Math.PI) / 180, 0, 0),
            mouseDistortionStrength,
            mouseDistortionSmoothness,
            mouseDistortionDecay,
            distortionTime: 0,
            mouseShrinkScaleStrength,
            mouseShrinkScaleRadius,
            _originalPositions: new Float32Array(),

            create: function (scene) {
                this.group = new THREE.Object3D();
                this.group.position.copy(this.move);
                this.group.rotation.copy(this.look);

                this.geometry = new THREE.PlaneGeometry(4000, 2000, geometryWidth, geometryHeight);
                this._originalPositions = new Float32Array(this.geometry.attributes.position.array);

                const waveColorValue = determineWaveColor();
                this.material = new THREE.MeshLambertMaterial({
                    color: waveColorValue,
                    opacity: opacity,
                    blending: opacity < 1 ? THREE.NormalBlending : THREE.NoBlending,
                    side: THREE.DoubleSide,
                    transparent: opacity < 1,
                    depthWrite: opacity >= 1,
                    wireframe: wireframe,
                });

                this.plane = new THREE.Mesh(this.geometry, this.material);
                this.simplex = createNoise2D();
                this.moveNoise({ x: 0, y: 0 });

                this.group.add(this.plane);
                scene.add(this.group);
            },

            moveNoise: function (mouse) {
                if (!this.geometry || !this.simplex || !this._originalPositions) return;

                const positions = this.geometry.attributes.position;
                const currentMouseX = mouseInteraction ? mouse.x : 0;
                const currentMouseY = mouseInteraction ? mouse.y : 0;
                this.distortionTime += this.mouseDistortionDecay;

                for (let i = 0; i < positions.count; i++) {
                    const originalX = this._originalPositions[i * 3];
                    const originalY = this._originalPositions[i * 3 + 1];

                    let newX = originalX;
                    let newY = originalY;

                    const xoff = originalX / this.factor;
                    const yoff = originalY / this.factor + this.cycle;
                    let zOffset = this.simplex(xoff, yoff) * this.scale;

                    if (mouseInteraction && this.mouseDistortionStrength > 0) {
                        const distX = originalX - currentMouseX * 0.5;
                        const distY = originalY - currentMouseY * 0.5;
                        const dist = Math.sqrt(distX * distX + distY * distY);
                        const ripple = this.simplex(distX / this.mouseDistortionSmoothness, distY / this.mouseDistortionSmoothness, this.distortionTime) * this.mouseDistortionStrength;
                        const falloff = Math.max(0, 1 - dist / (this.mouseShrinkScaleRadius * 2));
                        zOffset += ripple * this.scale * falloff;
                    }

                    if (mouseInteraction && this.mouseShrinkScaleStrength > 0) {
                        const distX = originalX - currentMouseX;
                        const distY = originalY - currentMouseY;
                        const dist = Math.sqrt(distX * distX + distY * distY);
                        if (dist < this.mouseShrinkScaleRadius) {
                            let shrink = Math.pow(1 - (dist / this.mouseShrinkScaleRadius), 2) * this.mouseShrinkScaleStrength;
                            newX = originalX - distX * shrink;
                            newY = originalY - distY * shrink;
                        }
                    }
                    positions.setXYZ(i, newX, newY, zOffset);
                }
                positions.needsUpdate = true;
                this.cycle += this.speed;
            },

            update: function (mouse) {
                this.moveNoise(mouse);
                if (mouseInteraction && this.group) {
                    this.move.x = -(mouse.x * 0.04);
                    this.move.y = waveOffsetY + (mouse.y * 0.04);
                    this.group.position.x += (this.move.x - this.group.position.x) / this.ease;
                    this.group.position.y += (this.move.y - this.group.position.y) / this.ease;
                }
            },

            dispose: function () {
                this.geometry?.dispose();
                this.material?.dispose();
                this.group?.remove(this.plane);
                this.plane = null;
                this.geometry = null;
                this.material = null;
                this.simplex = null;
                this.group = null;
            },
        };
        return groundPlain;
    }, [quality, smoothness, amplitude, speed, ease, waveOffsetY, cameraDistance, waveRotation, determineWaveColor, opacity, wireframe, mouseInteraction, getQualitySettings, mouseDistortionStrength, mouseDistortionSmoothness, mouseDistortionDecay, mouseShrinkScaleStrength, mouseShrinkScaleRadius]);

    useEffect(() => {
        if (!containerRef.current) return;

        const device = {
            width: () => window.innerWidth,
            height: () => window.innerHeight,
            ratio: () => window.innerWidth / window.innerHeight,
            cX: () => window.innerWidth / 2,
            cY: () => window.innerHeight / 2,
        };

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(fov, device.ratio(), 0.1, 20000);
        let renderer;

        try {
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(device.width(), device.height());
            renderer.setPixelRatio(window.devicePixelRatio);
            containerRef.current.appendChild(renderer.domElement);
        } catch (e) {
            setWebGLFailed(true);
            return;
        }

        const color = determineWaveColor();
        const pointLight = new THREE.PointLight(color, 4, 1000);
        pointLight.position.set(0, 200, -500);
        scene.add(pointLight);
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));

        const groundPlain = createGroundPlain();
        groundPlain.create(scene);

        sceneElementsRef.current = { scene, camera, renderer, groundPlain, mouse: { x: device.cX(), y: device.cY() } };

        const handleMouseMove = (e) => {
            if (mouseInteraction) {
                sceneElementsRef.current.mouse.x = e.clientX - device.cX();
                sceneElementsRef.current.mouse.y = e.clientY - device.cY();
            }
        };

        const handleResize = () => {
            camera.aspect = device.ratio();
            camera.updateProjectionMatrix();
            renderer.setSize(device.width(), device.height());
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        const animate = () => {
            if (!renderer || !scene || !camera || !groundPlain) return;
            groundPlain.update(sceneElementsRef.current.mouse);
            renderer.render(scene, camera);
            sceneElementsRef.current.animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(sceneElementsRef.current.animationFrameId);
            groundPlain.dispose();
            renderer.dispose();
            if (containerRef.current?.contains(renderer.domElement)) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, [fov, determineWaveColor, createGroundPlain, mouseInteraction]);

    return (
        <div style={{ perspective: '900px', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
            <div ref={containerRef} className={`animated-wave-container ${className}`} style={{ width: '100%', height: '100%', backgroundColor }} />
            {webGLFailed && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', background: 'rgba(0,0,0,0.7)', padding: '20px', borderRadius: '8px' }}>
                    WebGL Error: Unable to render wave.
                </div>
            )}
        </div>
    );
};

export default AnimatedWave;
