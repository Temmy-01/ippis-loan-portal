import { useCallback, useEffect, useRef, useState } from 'react'

const PHOTO_WIDTH = 720

const cameraMessage = (error: unknown) => {
  const name = (error as Error)?.name
  if (name === 'NotAllowedError') return 'Camera access was blocked. Allow camera access in your browser settings, then try again.'
  if (name === 'NotFoundError') return 'We could not find a camera on this device.'
  return 'We could not start your camera. Please try again.'
}

// Opens the front camera and takes one still photo as a JPG file.
export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraOn, setCameraOn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setCameraOn(false)
  }, [])

  const start = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => undefined)
      }
      setCameraOn(true)
    } catch (cameraError) {
      stop()
      setError(cameraMessage(cameraError))
    }
  }, [stop])

  const capture = useCallback(async (): Promise<File | null> => {
    const video = videoRef.current
    if (!video || !video.videoWidth) return null
    const scale = Math.min(1, PHOTO_WIDTH / video.videoWidth)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(video.videoWidth * scale)
    canvas.height = Math.round(video.videoHeight * scale)
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9))
    stop()
    return blob ? new File([blob], 'face-check.jpg', { type: 'image/jpeg' }) : null
  }, [stop])

  useEffect(() => stop, [stop])

  return { videoRef, cameraOn, error, start, stop, capture }
}
