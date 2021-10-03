var unicyclist = new Unicyclist();
var pedal_speed_ms = 100;
var last_pedal = 0;
var fallFrequency = 0.01 * score;
var fall_speed_ms = 3000;
var fall_progress = 0;
var fall_start = 0;
var score = 0;
var game_start = new Date().getTime();
var time_between_updates_ms = 50;
var last_update = 0;
var started = false;

var stripes_position = 0;
var stripes_speed = 1.2;

var meteorFrequency = 5000;
var lastMeteorTime = 0;
var activeMeteor = false;
var meteorID;
var meteors = [
  "#meteor-div",
  "#meteor1-div",
  "#meteor2-div",
  "#meteor3-div",
  "#meteor4-div"
];

$(document).ready(function() {
  window.requestAnimationFrame(fallLoop);
  setTimeout(function() {
    $(".clickable-areas").addClass("hide");
  }, 1200);
  $("#left .direction").text(Controls.LEFT);
  $("#right .direction").text(Controls.RIGHT);
  $("#left").click(function() {
    click_control(Controls.LEFT);
  });
  $("#right").click(function() {
    click_control(Controls.RIGHT);
  });
});

function click_control(control) {
  if (!started) {
    started = true;
    game_start = new Date().getTime();
    return;
  }

  if (unicyclist.State() == State.FALLEN) {
    restart();
    return;
  }

  if (unicyclist.State() != State.FALLING) return;

  if (unicyclist.TiltDirection() != control)
    unicyclist.setState(State.RECOVERING);
  else unicyclist.setState(State.FALLEN);
}

function fallLoop() {
  var now = new Date().getTime();
  if (now - last_update > time_between_updates_ms) {
    update();
    draw();
    last_update = new Date().getTime();
  }
  window.requestAnimationFrame(fallLoop);
}

function update() {
  if (!started) return;

  if (unicyclist.State() == State.IDLE) idle();
  else if (unicyclist.State() == State.RECOVERING) recovering();
  else falling();

  if (unicyclist.State() != State.FALLEN) {
    score = Math.floor((new Date().getTime() - game_start) / 1000);

    if (score >= 10) {
      var now = new Date().getTime();

      if (activeMeteor && now - lastMeteorTime >= 3000) {
        $(meteorID).css("display", "none");
        fall();
      } else if (!activeMeteor && now - (lastMeteorTime + 5000) >= 0) {
        meteorID = meteors[Math.floor(Math.random() * meteors.length)];

        activeMeteor = true;
        lastMeteorTime = now;

        $(meteorID).css("display", "");

        $(meteorID).click(function() {
          activeMeteor = false;
          $(this).css("display", "none");
        });
      }
    }
  }
}

function draw() {
  unicyclist.Draw();
  $("#score").text(score);
  if (unicyclist.State() == State.FALLEN)
    $("#game-over")
      .removeClass("hidden")
      .addClass("show");
}

function idle() {
  pedal();

  if (Math.random() < fallFrequency) beginFall();

  increaseDifficulty();
}

function recovering() {
  unicyclist.Balance();
  unicyclist.setState(State.IDLE);
}

function falling() {
  var now = new Date().getTime();
  var current_progress = (now - fall_start) / fall_speed_ms;

  if (current_progress >= 1) fall();
}

function beginFall() {
  unicyclist.SetFallSpeed(fall_speed_ms);
  fall_start = new Date().getTime();
  unicyclist.setState(State.FALLING);
  if (Math.random() < 0.5) {
    unicyclist.TiltRight();
  } else {
    unicyclist.TiltLeft();
  }
}

function increaseDifficulty() {
  fallFrequency = 0.01 * score;
  fall_speed_ms = -100 * score + 3000;
  if (fall_speed_ms < 0) fall_speed_ms = 50;
}

function pedal() {
  var now = new Date().getTime();
  if (now - last_pedal > pedal_speed_ms) {
    unicyclist.StepForwards();
    last_pedal = new Date().getTime();
  }
  $("#stripes").css("background-position", stripes_position + "% 0");
  stripes_position += stripes_speed;
}

function fall() {
  unicyclist.SetFallSpeed(0);
  unicyclist.setState(State.FALLEN);
}

function restart() {
  unicyclist.setState(State.IDLE);
  unicyclist.ClearFallenClasses();
  unicyclist.Balance();
  score = 0;
  game_start = new Date().getTime();
  fall_speed_ms = 3000;
  fallFrequency = score;
  lastMeteorTime = 0;
  activeMeteor = false;
  $("#game-over")
    .removeClass("show")
    .addClass("hidden");
}
