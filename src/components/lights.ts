import {
  Camera,
  Engine,
  HemisphericLight,
  Scene,
  SpotLight,
  Texture,
  Vector3,
  VolumetricLightScatteringPostProcess,
} from '@babylonjs/core'

export const loadLightEnvironment = ({
  scene,
  camera,
  engine,
}: {
  scene: Scene
  camera: Camera
  engine: Engine
}) => {
  const hemisphericLight = new HemisphericLight(
    'firstLight',
    new Vector3(0, 1, 0),
    scene,
  )
  hemisphericLight.intensity = 0.0005

  const lightPosition = new Vector3(-30, 20, 20)
  const light = new SpotLight(
    'spot02',
    lightPosition,
    new Vector3(0, 0, 0),
    1.1,
    16,
    scene,
  )
  light.intensity = 5000
  light.setDirectionToTarget(Vector3.Zero())

  const vls = new VolumetricLightScatteringPostProcess(
    'vls',
    { postProcessRatio: 1.0, passRatio: 0.5 },
    camera,
    null,
    75,
    Texture.BILINEAR_SAMPLINGMODE,
    engine,
    false,
  )

  vls.mesh.position = lightPosition
  vls.mesh.scaling = new Vector3(1, 1, 1)
  vls._volumetricLightScatteringRTT.renderParticles = true
  vls.exposure = 0.1
  vls.decay = 0.96815
  vls.weight = 0.98767
  vls.density = 0.996
  light.position = vls.mesh.position

  return {  light }
}
