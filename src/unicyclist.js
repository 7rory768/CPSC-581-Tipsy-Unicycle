class Unicyclist {
  constructor() {
    this.frames = [
      "Step1.png",
      "Step2.png",
      "Step3.png",
      "Step4.png",
      "Step5.png",
      "Step6.png",
      "Step7.png",
      "Step8.png"
    ];
    this.fallen_right_frame = "FallRight.png";
    this.fallen_left_frame = "FallLeft.png";
    this.current_frame_index = 2;
    this.current_tilt_direction = TiltDirections.STABLE;
    this.state = State.IDLE;
  }

  State() {
    return this.state;
  }
  TiltDirection() {
    return this.current_tilt_direction;
  }
  setState(state) {
    this.state = state;
  }
  TotalFrames() {
    return this.frames.length;
  }
  CurrentFrame() {
    if (this.state == State.FALLEN) return this.FallFrame();

    return this.frames[this.current_frame_index];
  }
  StepBackwards() {
    if (this.current_frame_index == 0)
      this.current_frame_index = this.TotalFrames() - 1;
    else this.current_frame_index--;
  }
  StepForwards() {
    this.current_frame_index++;
    this.current_frame_index %= this.TotalFrames();
  }
  Balance() {
    this.current_tilt_direction = TiltDirections.STABLE;
  }
  TiltRight() {
    this.current_tilt_direction = TiltDirections.RIGHT;
  }
  TiltLeft() {
    this.current_tilt_direction = TiltDirections.LEFT;
  }
  ClearTiltClasses() {
    $("#unicyclist").removeClass(function(index, className) {
      return (className.match(/(^|\s)tilt-(left|right)/g) || []).join(" ");
    });
  }
  ClearFallenClasses() {
    $("#unicyclist").removeClass(function(index, className) {
      return (className.match(/(^|\s)fallen-(left|right)/g) || []).join(" ");
    });
  }
  SetFallSpeed(speed_ms) {
    $("#unicyclist").css("transition", "transform " + speed_ms + "ms ease");
  }
  Draw() {
    $("#unicyclist").attr("src", ASSETS_DIR + this.CurrentFrame());
    this.ClearTiltClasses();
    this.SetTiltClass();
  }
  SetTiltClass() {
    if (this.state == State.FALLEN) {
      $("#unicyclist").addClass(
        "fallen-" +
          (this.current_tilt_direction == TiltDirections.LEFT
            ? "left"
            : "right")
      );
      return;
    }
    if (this.current_tilt_direction == TiltDirections.LEFT)
      $("#unicyclist").addClass("tilt-left");
    else if (this.current_tilt_direction == TiltDirections.RIGHT)
      $("#unicyclist").addClass("tilt-right");
  }
  FallFrame() {
    if (this.current_tilt < 0) return this.fallen_left_frame;
    else return this.fallen_right_frame;
  }
}
