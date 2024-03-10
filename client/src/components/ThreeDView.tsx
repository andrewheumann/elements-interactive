'use client'
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Model from "./Model";
import { useState } from "react";
import { useControls } from "leva";

export default function ThreeDView() {
    // keep the error as a string, or null if no error
    const [error, setError] = useState<string | undefined>(undefined);

    const onError = (error: Error | undefined) => {
        setError(error?.message);
    };

    // The parameters for the model should match the parameters in the `ModelRequest` class on the server.
    const cubeParameters = useControls('cube', {
        Width: 10,
        Depth: 20,
        Height: 10,
        Color: '#ff0000',
    })

    // const gridParameters = useControls('grid', {
    //     U: {
    //         value: 4,
    //         min: 1,
    //         max: 12,
    //         step: 1,
    //       },
    //     V: {
    //         value: 4,
    //         min: 1,
    //         max: 12,
    //         step: 1,
    //       },
    //     Size: 10.0,
    //     Point: {
    //         value: { x: 0, y: 0 },
    //         max: 20,
    //         min: -20,
    //     }
    // })

    return (
        <div className="relative w-full h-full"> {/* Ensure the parent div is relative for absolute positioning within it */}
            <Canvas className="w-full h-full"
                camera={{
                    position: [10, 50, 10], // Set the default camera position
                }}
            >
                {/* Scene setup. Establish lights, camera, controls, stuff that doesn't change as objects change. */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[-2, 5, 2]} intensity={1} />
                <OrbitControls target={[0, 0, 0]} />

                {/* The element geometry we're creating. */}

                {/* You can pass a parameters object directly... */}
                {/* <Model
                    endpoint={'model'}
                    parameters={{
                        Width: 50,
                        Depth: 20,
                        Height: 1,
                        Color: '#0022ee',
                    }}
                    onError={onError}
                /> */}
                {/* Or you can pass in parameters from `useControls`, which makes the parameters interactive. */}
                <Model
                    endpoint={'model'}
                    parameters={cubeParameters}
                    onError={onError}
                />
                {/* You can have as many different endpoints as you want! */}
                {/* <Model
                    endpoint={'grid'}
                    parameters={gridParameters}
                    onError={onError}
                /> */}

            </Canvas>
            {error && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-2 border border-red-500 rounded-md shadow-lg text-red-500">
                    Error: {error}
                </div>
            )}
        </div>
    );
}
