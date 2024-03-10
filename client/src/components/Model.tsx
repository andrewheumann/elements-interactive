'use client'
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import PostRequestElement from "./PostRequestElement";
import { useState } from "react";

export default function Model() {
    // keep the error as a string, or null if no error
    const [error, setError] = useState<string | undefined>(undefined);

    const onError = (error: Error | undefined) => {
        setError(error?.message);
    };

    return (
        <div className="relative w-full h-full"> {/* Ensure the parent div is relative for absolute positioning within it */}
            <Canvas className="w-full h-full"
                camera={{
                    position: [10, 20, 10], // Set the default camera position
                }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[-2, 5, 2]} intensity={1} />
                <PostRequestElement onError={onError}/>
                <OrbitControls target={[0, 0, 0]} />
            </Canvas>
            {error && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-2 border border-red-500 rounded-md shadow-lg text-red-500">
                    Error: {error}
                </div>
            )}
        </div>
    );
}
