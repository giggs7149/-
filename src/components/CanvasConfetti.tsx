import React, { useEffect, useRef } from "react";

interface ConfettiProps {
  active: boolean;
  onShake?: () => void;
}

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  aspectRatio: number;
  shape: "circle" | "rectangle" | "triangle" | "squiggle";
  rotation: number;
  rotationSpeed: number;
  wobble: number;
  wobbleSpeed: number;
  opacity: number;
  decay: number;
  gravity: number;
  drag: number;
}

const COLORS = [
  "#FF007F", // Bright Pink
  "#FFD700", // Gold
  "#00E5FF", // Cyan
  "#9D00FF", // Purple
  "#39FF14", // Lime Green
  "#FF7F00", // Orange
  "#FF3333", // Red
  "#4D79FF", // Blue
];

export const CanvasConfetti: React.FC<ConfettiProps> = ({ active, onShake }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const particlesRef = useRef<ConfettiParticle[]>([]);

  // Function to create standard side launch bursts
  const createBurst = (width: number, height: number, count: number) => {
    const particles: ConfettiParticle[] = [];

    // Left launcher (shoots up and right)
    for (let i = 0; i < count / 2; i++) {
      particles.push(createParticleInstance(0, height * 0.8, 45, width, height));
    }

    // Right launcher (shoots up and left)
    for (let i = 0; i < count / 2; i++) {
      particles.push(createParticleInstance(width, height * 0.8, 135, width, height));
    }

    // Center rain
    for (let i = 0; i < count / 4; i++) {
      particles.push({
        x: Math.random() * width,
        y: -20 - Math.random() * 100,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 4 + 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 8 + 6,
        aspectRatio: Math.random() * 0.6 + 0.7,
        shape: getRandomShape(),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.05 + 0.02,
        opacity: 1,
        decay: Math.random() * 0.005 + 0.002,
        gravity: Math.random() * 0.15 + 0.1,
        drag: 0.98,
      });
    }

    return particles;
  };

  const createParticleInstance = (
    startX: number,
    startY: number,
    angleDeg: number,
    width: number,
    height: number
  ): ConfettiParticle => {
    // Angle in radians with some jitter
    const angleRad = (angleDeg + (Math.random() - 0.5) * 30) * (Math.PI / 180);
    const speed = Math.random() * 15 + 12;

    return {
      x: startX,
      y: startY,
      vx: Math.cos(angleRad) * speed,
      vy: -Math.sin(angleRad) * speed, // Negative is up in canvas y-space
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 9 + 6,
      aspectRatio: Math.random() * 0.6 + 0.6,
      shape: getRandomShape(),
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.08 + 0.03,
      opacity: 1,
      decay: Math.random() * 0.008 + 0.004,
      gravity: Math.random() * 0.2 + 0.18,
      drag: 0.95,
    };
  };

  const getRandomShape = (): "circle" | "rectangle" | "triangle" | "squiggle" => {
    const choices: ("circle" | "rectangle" | "triangle" | "squiggle")[] = [
      "circle",
      "rectangle",
      "triangle",
      "squiggle",
    ];
    return choices[Math.floor(Math.random() * choices.length)];
  };

  // Add clicking to spawn confetti
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Launch a spectacular 360-degree burst from clicked area!
    const newParticles: ConfettiParticle[] = [];
    for (let i = 0; i < 28; i++) {
      const angleRad = Math.random() * Math.PI * 2;
      const speed = Math.random() * 10 + 4;
      newParticles.push({
        x: clickX,
        y: clickY,
        vx: Math.cos(angleRad) * speed,
        vy: Math.sin(angleRad) * speed - 2, // Slight bias upward
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 8 + 5,
        aspectRatio: Math.random() * 0.6 + 0.7,
        shape: getRandomShape(),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.1 + 0.04,
        opacity: 1,
        decay: Math.random() * 0.015 + 0.008,
        gravity: 0.18,
        drag: 0.96,
      });
    }

    particlesRef.current.push(...newParticles);
    if (onShake) {
      onShake();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use ResizeObserver to respond properly to any container dimension shifts
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        // Directly configure width & height on canvas
        canvas.width = width;
        canvas.height = height;
      }
    });

    resizeObserver.observe(container);

    // If active turns true, spawn aninitial massive celebration!
    if (active) {
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 700;
      particlesRef.current = createBurst(w, h, 150);
      if (onShake) {
        onShake();
      }
    } else {
      // Clean up when not active
      particlesRef.current = [];
    }

    const drawParticle = (c: CanvasRenderingContext2D, p: ConfettiParticle) => {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rotation);
      
      // Calculate real width & height using aspectRatio & wobble sway
      const wobbleSway = Math.sin(p.wobble);
      const w = p.size * wobbleSway;
      const h = p.size * p.aspectRatio;

      c.fillStyle = p.color;
      c.strokeStyle = p.color;
      c.lineWidth = 2;
      c.globalAlpha = p.opacity;

      if (p.shape === "rectangle") {
        c.fillRect(-w / 2, -h / 2, w, h);
      } else if (p.shape === "circle") {
        c.beginPath();
        c.ellipse(0, 0, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2);
        c.fill();
      } else if (p.shape === "triangle") {
        c.beginPath();
        c.moveTo(0, -h / 2);
        c.lineTo(w / 2, h / 2);
        c.lineTo(-w / 2, h / 2);
        c.closePath();
        c.fill();
      } else if (p.shape === "squiggle") {
        c.beginPath();
        c.moveTo(-w / 2, -h / 2);
        c.bezierCurveTo(-w / 4, -h / 4, w / 4, -h * 0.75, w / 2, -h / 2);
        c.stroke();
      }

      c.restore();
    };

    const loop = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Apply physics
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;

        // Apply visual sways & rotations
        p.rotation += p.rotationSpeed;
        p.wobble += p.wobbleSpeed;

        // Apply decay
        p.opacity -= p.decay;

        // Boundary checks or opacity checks
        if (p.opacity <= 0 || p.y > canvas.height + 40 || p.x < -40 || p.x > canvas.width + 40) {
          particles.splice(i, 1);
          continue;
        }

        drawParticle(ctx, p);
      }

      // If we have particles and active state is true (or fading remainder), continue animating
      if (particles.length > 0 || active) {
        requestRef.current = requestAnimationFrame(loop);
      }
    };

    // Begin render flow
    requestRef.current = requestAnimationFrame(loop);

    return () => {
      resizeObserver.disconnect();
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [active]);

  // Periodic automatic top-drops to keep the screen decorated if active is true!
  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      const container = containerRef.current;
      if (!container) return;
      const width = container.clientWidth || 400;

      // Spawn 8 slow rain particles from top periodically
      const rain: ConfettiParticle[] = [];
      for (let i = 0; i < 4; i++) {
        rain.push({
          x: Math.random() * width,
          y: -15,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 2 + 1.5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          size: Math.random() * 8 + 5,
          aspectRatio: Math.random() * 0.6 + 0.6,
          shape: getRandomShape(),
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.1,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.05 + 0.02,
          opacity: 1,
          decay: Math.random() * 0.004 + 0.002,
          gravity: Math.random() * 0.1 + 0.07,
          drag: 0.99,
        });
      }
      particlesRef.current.push(...rain);
    }, 1100);

    return () => clearInterval(interval);
  }, [active]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none z-50 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full pointer-events-none block"
      />
    </div>
  );
};
