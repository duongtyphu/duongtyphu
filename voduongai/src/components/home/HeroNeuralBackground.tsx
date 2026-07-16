"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const DESKTOP_PARTICLES = 2000;
const DESKTOP_LINES = 1000;
const NETWORK_BOUNDS = { x: 7.5, y: 4.6, z: 3.2 };
const LINK_THRESHOLD = 1.5;

function buildNetwork(particleCount: number, maxLines: number) {
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() * 2 - 1) * NETWORK_BOUNDS.x;
    positions[i * 3 + 1] = (Math.random() * 2 - 1) * NETWORK_BOUNDS.y;
    positions[i * 3 + 2] = (Math.random() * 2 - 1) * NETWORK_BOUNDS.z;
  }

  const candidates: { a: number; b: number; d: number }[] = [];
  const thresholdSq = LINK_THRESHOLD * LINK_THRESHOLD;

  for (let i = 0; i < particleCount; i++) {
    const ax = positions[i * 3];
    const ay = positions[i * 3 + 1];
    const az = positions[i * 3 + 2];
    for (let j = i + 1; j < particleCount; j++) {
      const dx = ax - positions[j * 3];
      const dy = ay - positions[j * 3 + 1];
      const dz = az - positions[j * 3 + 2];
      const d = dx * dx + dy * dy + dz * dz;
      if (d < thresholdSq) candidates.push({ a: i, b: j, d });
    }
  }

  candidates.sort((p, q) => p.d - q.d);
  const picked = candidates.slice(0, maxLines);

  const linePositions = new Float32Array(picked.length * 6);
  picked.forEach((pair, idx) => {
    linePositions[idx * 6] = positions[pair.a * 3];
    linePositions[idx * 6 + 1] = positions[pair.a * 3 + 1];
    linePositions[idx * 6 + 2] = positions[pair.a * 3 + 2];
    linePositions[idx * 6 + 3] = positions[pair.b * 3];
    linePositions[idx * 6 + 4] = positions[pair.b * 3 + 1];
    linePositions[idx * 6 + 5] = positions[pair.b * 3 + 2];
  });

  return { positions, linePositions };
}

export function HeroNeuralBackground({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const width = container.clientWidth || window.innerWidth;
    const isSmall = width < 640;
    const isMedium = width < 1024;
    const particleCount = isSmall ? 800 : isMedium ? 1400 : DESKTOP_PARTICLES;
    const maxLines = isSmall ? 380 : isMedium ? 700 : DESKTOP_LINES;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 9;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmall ? 1.5 : 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const { positions, linePositions } = buildNetwork(particleCount, maxLines);

    const group = new THREE.Group();

    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0xbfd4ff,
      size: 0.045,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    group.add(points);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x5b8cff,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    group.add(lines);

    scene.add(group);

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    let frameId = 0;
    const animate = () => {
      group.rotation.y += 0.0007;
      group.rotation.x += 0.00022;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    if (prefersReducedMotion) {
      renderer.render(scene, camera);
    } else {
      animate();
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (frameId) cancelAnimationFrame(frameId);
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={className ?? "absolute inset-0"}
    />
  );
}
