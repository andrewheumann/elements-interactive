import React, { useState, useEffect, Suspense } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useControls } from 'leva'
import { convertParameters } from './convertParameters'

function base64ToBlob(base64: string, type = "application/octet-stream") {
    const binStr = atob(base64)
    const len = binStr.length
    const arr = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i)
    }
    return new Blob([arr], { type })
}

function GLTFModel({ gltfUrl }: { gltfUrl: string }) {
    const gltf = useLoader(GLTFLoader, gltfUrl)
    return <primitive object={gltf.scene} />
}

export default function PostRequestElement({ onError }: { onError: (error: any) => void }) {
    // The parameters for the model should match the parameters in the `ModelRequest` class on the server.
    const parameters = useControls({
        Width: 10,
        Depth: 10,
        Height: 5,
        Color: '#ff0000',
    })
    const [gltfUrl, setGltfUrl] = useState<string | null>(null)

    useEffect(() => {
        // Async function to fetch GLTF data based on Size
        const fetchGltfData = async (params: typeof parameters) => {
            try {
                const response = await fetch('http://localhost:5221/model', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: convertParameters(params),
                    mode: 'cors',
                })
                const data = await response.json()
                const gltfBase64 = data.gltf
                const gltfBlob = base64ToBlob(gltfBase64, 'model/gltf-binary')
                const url = URL.createObjectURL(gltfBlob)
                setGltfUrl(url)
            } catch (error) {
                onError(error)
                setGltfUrl(null)
            }
        }

        fetchGltfData(parameters)
    }, [parameters, onError]) // This will re-run the effect whenever the Size value changes

    return (
        <Suspense fallback={<mesh></mesh>}>
            {gltfUrl && <GLTFModel gltfUrl={gltfUrl} />}
        </Suspense>
    )
}
