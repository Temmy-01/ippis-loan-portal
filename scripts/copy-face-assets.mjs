import { cpSync, mkdirSync } from 'node:fs'

mkdirSync('public/face/wasm', { recursive: true })
cpSync('node_modules/@mediapipe/tasks-vision/wasm', 'public/face/wasm', { recursive: true })
