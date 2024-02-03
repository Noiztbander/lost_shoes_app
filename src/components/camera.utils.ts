import {
  Camera,
  DefaultRenderingPipeline,
  LensRenderingPipeline,
  Scene,
} from '@babylonjs/core'

export const loadLensEffects = (scene: Scene, camera: Camera) => {
  new LensRenderingPipeline(
    'lens',
    {
      edge_blur: 1.0,
      chromatic_aberration: 1.0,
      distortion: 1.0,
      dof_focus_distance: 40,
      dof_aperture: 4.0,
      grain_amount: 1.0,
      dof_pentagon: true,
      dof_gain: 1.0,
      dof_threshold: 1.0,
      dof_darken: 0.25,
    },
    scene,
    1.0,
    [camera],
  )
}

export const loadCameraPipeline = (scene: Scene, camera: Camera) => {
  const defaultPipeline = new DefaultRenderingPipeline('default', true, scene, [
    camera,
  ])
  defaultPipeline.bloomEnabled = true
  defaultPipeline.fxaaEnabled = true
  defaultPipeline.bloomWeight = 0.5
  defaultPipeline.cameraFov = camera.fov
}
