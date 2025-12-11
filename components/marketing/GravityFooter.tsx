"use client";

import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
// Poly-decomp is required for concave shapes (like text if we were tracing paths, but useful to have)
import 'poly-decomp'; 

export const GravityFooter = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    // Module aliases
    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint;

    // Create engine
    const engine = Engine.create();
    engineRef.current = engine;

    // Get container dimensions
    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    // Create renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio
      }
    });
    renderRef.current = render;

    // Create walls
    const wallOptions = { 
        isStatic: true, 
        render: { fillStyle: 'transparent' } 
    };
    
    const ground = Bodies.rectangle(width / 2, height + 50, width + 200, 100, wallOptions);
    const leftWall = Bodies.rectangle(-50, height / 2, 100, height * 2, wallOptions);
    const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height * 2, wallOptions);

    Composite.add(engine.world, [ground, leftWall, rightWall]);

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

    // Prevent mouse wheel scrolling from being intercepted by matter.js
    mouse.element.removeEventListener("mousewheel", (mouse as any).mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", (mouse as any).mousewheel);

    Composite.add(engine.world, mouseConstraint);

    // Create currency symbols as bodies
    // Since matter.js doesn't support text bodies natively easily without SVG paths,
    // we'll use circles with textures (images) or just custom rendering.
    // For simplicity and performance, we'll use circles and render text on top using the `afterRender` event
    // or creating textures. Creating textures via canvas is cleaner.

    const currencies = ['$', '£', '₿', '€', '¥'];
    const colors = ['#10b981', '#34d399', '#6ee7b7', '#059669', '#ffffff']; // Emerald shades + white

    const createCurrencyTexture = (text: string, color: string, radius: number) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const size = radius * 2;
        canvas.width = size;
        canvas.height = size;

        if (context) {
            context.fillStyle = color;
            context.beginPath();
            context.arc(radius, radius, radius, 0, 2 * Math.PI);
            context.fill();

            context.fillStyle = '#000000'; // Text color
            context.font = `bold ${radius * 1.2}px Arial`;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(text, radius, radius + (radius * 0.1)); // Slight vertical adjustment
        }
        return canvas.toDataURL();
    };
    
    const addCurrencyBall = () => {
        const radius = Math.random() * 20 + 20; // Radius between 20-40
        const x = Math.random() * width;
        const y = -Math.random() * 500 - 50; // Start above the view
        const color = colors[Math.floor(Math.random() * colors.length)];
        const currency = currencies[Math.floor(Math.random() * currencies.length)];
        
        const texture = createCurrencyTexture(currency, color, radius);

        const ball = Bodies.circle(x, y, radius, {
            restitution: 0.6, // Bouncy
            friction: 0.005,
            render: {
                sprite: {
                    texture: texture,
                    xScale: 1, // Scale matches the generated canvas size
                    yScale: 1
                }
            }
        });
        
        Composite.add(engine.world, ball);
    };

    // Add initial batch of currency balls
    for (let i = 0; i < 25; i++) {
        setTimeout(addCurrencyBall, i * 150);
    }

    // Create runner
    const runner = Runner.create();

    // Intersection Observer to lazy load the physics
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (!engine.world.bodies.length) { // Prevent duplicate initialization if needed or just to be safe
                         // Re-add bodies if we cleared them, but here we just run the runner
                    }
                    Runner.run(runner, engine);
                    Render.run(render);
                } else {
                    Runner.stop(runner);
                    Render.stop(render);
                }
            });
        },
        { threshold: 0.1 }
    );

    if (sceneRef.current) {
        observer.observe(sceneRef.current);
    }

    // Cleanup
    return () => {
      observer.disconnect();
      Render.stop(render);
      Runner.stop(runner);
      if (render.canvas) render.canvas.remove();
      Composite.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, []);

  return (
    <div 
        ref={sceneRef} 
        className="absolute inset-0 w-full h-full pointer-events-auto z-0 opacity-40"
    />
  );
};
