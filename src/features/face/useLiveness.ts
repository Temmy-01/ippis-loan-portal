import type { FaceLandmarker, FaceLandmarkerResult } from '@mediapipe/tasks-vision'
import { useCallback, useEffect, useRef, useState } from 'react'

export type LivenessStage = 'idle' | 'loading' | 'preparing' | 'position' | 'blink' | 'turn' | 'center' | 'done' | 'error'

export const STAGE_TEXT: Record<LivenessStage, string> = {
  idle: 'Camera preview will appear here',
  loading: 'Getting the camera ready…',
  preparing: 'Getting the face check ready…',
  position: 'Place your face inside the guide',
  blink: 'Now blink your eyes',
  turn: 'Slowly turn your head to the side',
  center: 'Great, now look straight at the camera',
  done: 'Face check complete',
  error: 'The camera is not available',
}

const CAMERA_ERRORS: Record<string, string> = {
  NotAllowedError: 'Camera access was blocked. Allow camera access in your browser settings and try again.',
  NotFoundError: "We couldn't find a camera on this device. Try again on a phone or a computer with a camera.",
  NotReadableError: 'Your camera is being used by another app. Close it and try again.',
}

const BLINK_CLOSED = 0.5
const BLINK_OPEN = 0.25
const TURNED = 0.3
const CENTERED = 0.1
const STEADY_FRAMES = 4
const MIN_GAP_MS = 200
const TOO_SLOW_MS = 1500
const SAMPLE_WIDTH = 320

let landmarkerPromise: Promise<FaceLandmarker> | null = null

const loadLandmarker = () => {
  landmarkerPromise ??= (async () => {
    const { FaceLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision')
    const vision = await FilesetResolver.forVisionTasks('/face/wasm')
    return FaceLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: '/face/face_landmarker.task', delegate: 'CPU' },
      runningMode: 'VIDEO',
      numFaces: 2,
      outputFaceBlendshapes: true,
    })
  })().catch((error) => {
    landmarkerPromise = null
    throw error
  })
  return landmarkerPromise
}

export const preloadLandmarker = () => {
  loadLandmarker().catch(() => undefined)
}

const blinkScore = (result: FaceLandmarkerResult) => {
  const categories = result.faceBlendshapes?.[0]?.categories ?? []
  const score = (name: string) => categories.find((item) => item.categoryName === name)?.score ?? 0
  return Math.min(score('eyeBlinkLeft'), score('eyeBlinkRight'))
}

const headTurn = (result: FaceLandmarkerResult) => {
  const points = result.faceLandmarks[0]
  const nose = points[1]
  const left = points[33]
  const right = points[263]
  const width = Math.abs(right.x - left.x) || 1
  return (nose.x - (left.x + right.x) / 2) / width
}

const inGuide = (result: FaceLandmarkerResult) => {
  const nose = result.faceLandmarks[0][1]
  return nose.x > 0.3 && nose.x < 0.7 && nose.y > 0.25 && nose.y < 0.75
}

const sampleFrame = (video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
  const width = SAMPLE_WIDTH
  const height = Math.round((video.videoHeight / video.videoWidth) * width) || 240
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
  }
  canvas.getContext('2d')?.drawImage(video, 0, 0, width, height)
  return canvas
}

const snapshot = (video: HTMLVideoElement) =>
  new Promise<File>((resolve, reject) => {
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    canvas.toBlob(
      (blob) => (blob ? resolve(new File([blob], 'face-check.jpg', { type: 'image/jpeg' })) : reject(new Error('capture failed'))),
      'image/jpeg',
      0.9,
    )
  })

export function useLiveness(onCaptured: (photo: File) => void) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const warningRef = useRef<string | null>(null)
  const sampleRef = useRef<HTMLCanvasElement | null>(null)
  const progress = useRef({ steady: 0, eyesClosed: false })
  const [stage, setStage] = useState<LivenessStage>('idle')
  const [warning, setWarning] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const showWarning = useCallback((message: string | null) => {
    if (warningRef.current === message) return
    warningRef.current = message
    setWarning(message)
  }, [])

  const stop = useCallback(() => {
    clearTimeout(timerRef.current)
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }, [])

  useEffect(() => stop, [stop])

  const watch = useCallback(
    (landmarker: FaceLandmarker) => {
      let current: LivenessStage = 'position'
      const move = (next: LivenessStage) => {
        current = next
        progress.current = { steady: 0, eyesClosed: false }
        setStage(next)
      }

      const next = (delay: number) => {
        timerRef.current = setTimeout(tick, delay)
      }

      const tick = async () => {
        const video = videoRef.current
        if (!video || !streamRef.current) return
        if (video.readyState < 2) {
          next(MIN_GAP_MS)
          return
        }

        sampleRef.current ??= document.createElement('canvas')
        const startedAt = performance.now()
        const result = landmarker.detectForVideo(sampleFrame(video, sampleRef.current), startedAt)
        const took = performance.now() - startedAt
        if (took > TOO_SLOW_MS) {
          stop()
          setError('This device is too slow for the face check. Please try again on a phone or another computer.')
          setStage('error')
          return
        }
        const faces = result.faceLandmarks.length
        if (faces === 0) showWarning('We cannot see your face. Move into the guide.')
        else if (faces > 1) showWarning('Only one person should be in front of the camera.')
        else if (!inGuide(result)) showWarning('Move your face into the middle of the guide.')
        else showWarning(null)

        if (faces === 1 && inGuide(result)) {
          const blink = blinkScore(result)
          const turn = Math.abs(headTurn(result))

          if (current === 'position' && ++progress.current.steady >= STEADY_FRAMES) move('blink')
          else if (current === 'blink') {
            if (blink > BLINK_CLOSED) progress.current.eyesClosed = true
            else if (progress.current.eyesClosed && blink < BLINK_OPEN) move('turn')
          } else if (current === 'turn' && turn > TURNED) move('center')
          else if (current === 'center' && turn < CENTERED && blink < BLINK_OPEN) {
            if (++progress.current.steady >= STEADY_FRAMES) {
              try {
                const photo = await snapshot(video)
                stop()
                setStage('done')
                onCaptured(photo)
              } catch {
                setError("We couldn't take your photo. Please try again.")
                setStage('error')
                stop()
              }
              return
            }
          }
        } else if (current === 'position' || current === 'center') {
          progress.current.steady = 0
        }

        next(Math.max(MIN_GAP_MS, took * 2))
      }

      move('position')
      next(0)
    },
    [onCaptured, showWarning, stop],
  )

  const start = useCallback(async () => {
    setError(null)
    showWarning(null)
    setStage('loading')
    const engine = loadLandmarker()
    engine.catch(() => undefined)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => undefined)
      }
      setStage('preparing')
    } catch (cameraError) {
      stop()
      const name = (cameraError as Error)?.name
      setError(CAMERA_ERRORS[name] ?? "We couldn't start your camera. Please refresh the page and try again.")
      setStage('error')
      return
    }

    try {
      const landmarker = await engine
      if (!streamRef.current) return
      watch(landmarker)
    } catch {
      stop()
      setError("We couldn't load the face check. Check your internet connection and try again.")
      setStage('error')
    }
  }, [showWarning, stop, watch])

  const reset = useCallback(() => {
    stop()
    setStage('idle')
    showWarning(null)
    setError(null)
  }, [showWarning, stop])

  return { videoRef, stage, warning, error, start, reset, cameraOn: ['preparing', 'position', 'blink', 'turn', 'center'].includes(stage) }
}
