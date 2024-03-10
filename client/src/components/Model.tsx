import React, { useState, useEffect, Suspense } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { convertParameters } from './convertParameters'

const apiUrl = process.env.API_BASE_URL || 'http://localhost:5221';
console.log(process.env)

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

export default function Model({ endpoint, parameters, onError }: { endpoint: string, parameters: any, onError: (error: any) => void }) {
    const [gltfUrl, setGltfUrl] = useState<string | null>(null)

    useEffect(() => {
        // Async function to fetch GLTF data based on parameters
        const fetchGltfData = async (params: typeof parameters) => {
            try {
                const response = await fetch(`${apiUrl}/${endpoint}`, {
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
                onError(`${endpoint}: ${error}\n${JSON.stringify(parameters)}`)
                setGltfUrl(null)
            }
        }

        fetchGltfData(parameters)
    }, [parameters, onError]) // This will re-run the effect whenever the parameters change

    return (
        <Suspense fallback={<mesh></mesh>}>
            {gltfUrl && <GLTFModel gltfUrl={gltfUrl} />}
        </Suspense>
    )
}
