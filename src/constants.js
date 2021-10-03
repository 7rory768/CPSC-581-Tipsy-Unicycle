const ASSETS_DIR = "assets/";
const TOTAL_TILT_DEGREES = 8;

const State = {
  IDLE: "Idle",
  FALLING: "Falling",
  RECOVERING: "Recovering",
  FALLEN: "Fallen"
};

const TiltDirections = {
  LEFT: "Left",
  RIGHT: "Right",
  STABLE: "Stable"
};

const Controls = {
  LEFT:TiltDirections.LEFT,
  RIGHT:TiltDirections.RIGHT
}