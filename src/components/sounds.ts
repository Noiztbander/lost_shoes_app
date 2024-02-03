import { Engine, Scene, Sound } from '@babylonjs/core'

export const nightAmbience = (scene: Scene) => {
  new Sound('Music', '/sounds/night_ambience.wav', scene, null, {
    loop: true,
    autoplay: true,
  })
  Engine.audioEngine?.setGlobalVolume(0.5)
}
