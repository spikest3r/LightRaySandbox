import init, {Vector2, reflect, mul, add, get_mirror_normal, normalize, intersect_ray_with_segment, dist} from './light_sandbox.js';
await init();

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "black";
ctx.fillRect(0,0,900,600);

var focalRangeControl = document.getElementById("focal1");
var r1RangeControl = document.getElementById("r1");
var r2RangeControl = document.getElementById("r2");
var r3RangeControl = document.getElementById("r3");

// setup

let lens_x = 400;
let lens_y = 300;
let lens_height = 100;
let lens_f = -150;

function focal1Change() {
    lens_f = focalRangeControl.value;
}
focalRangeControl.addEventListener("input", focal1Change);

let mirror_start = Vector2.new(650,200);
let mirror_end = Vector2.new(750,300);

const rays = [
    { pos: Vector2.new(50, 300-40), dir: normalize(Vector2.new(1, 0.1)), color:"yellow"},
    { pos: Vector2.new(50, 300),    dir: normalize(Vector2.new(1, 0)), color:"magenta" },
    { pos: Vector2.new(50, 300+40), dir: normalize(Vector2.new(1, -0.1)), color:"green" },
];

document.getElementById("rzero").addEventListener("click",() => {
    rays[0].dir.y = 0;
    rays[1].dir.y = 0;
    rays[2].dir.y = 0;
    r1RangeControl.value = 0;
    r1RangeControl.value = 0;
    r1RangeControl.value = 0;
});

function rChange(rayId, value) {
    rays[rayId].dir.y = value;
}

r1RangeControl.addEventListener("input", () => {rChange(0,r1RangeControl.value)});
r2RangeControl.addEventListener("input", () => {rChange(1,r2RangeControl.value)});
r3RangeControl.addEventListener("input", () => {rChange(2,r3RangeControl.value)});
rChange(0,r1RangeControl.value);
rChange(1, r2RangeControl.value);
rChange(2,r3RangeControl.value);

var rayStateControls = [document.getElementById("r1c"),document.getElementById("r2c"),document.getElementById("r3c")];

let drag_target = undefined;
let offset = Vector2.new(0,0);

function getCoords(event) {
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    
    const rect = canvas.getBoundingClientRect();
    
    return {
        mx: clientX - rect.left,
        my: clientY - rect.top
    };
}

function line(lineColor, x1,y1,x2,y2) {
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function circle(color,x,y,radius) {
    ctx.beginPath();
    ctx.arc(x,y,radius,0,2*Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.stroke();
}

function handleStart(event) {
    if (event.touches) {
        event.preventDefault(); 
    }
    
    const { mx, my } = getCoords(event);
    const pos = Vector2.new(mx,my);
    
    if(dist(pos,mirror_start) < 12) {
        drag_target = "m1";
        return;
    } else if(dist(pos,mirror_end) < 12) {
        drag_target = "m2"
        return;
    } else {
        var i = 1;
        for(const r of rays) {
            if(dist(pos,r.pos) < 12) {
                drag_target = "r" + String(i);
                return;
            }
            i+=1;
        }
    }

    let lens_top = lens_y - lens_height / 2;
    let lens_bottom = lens_y + lens_height / 2;

    let lens_left = lens_x - 10;
    let lens_right = lens_x + 10;
    if (lens_left <= mx && mx <= lens_right && 
        lens_top <= my && my <= lens_bottom) 
    {
        drag_target = "lens";
        offset.x = lens_x - mx;
        offset.y = lens_y - my; 
    }
}

function handleStop(event) {
    drag_target = undefined;
}

function handleMove(event) {
    if(!drag_target) return;

    if (event.touches) {
        event.preventDefault();
    }

    const { mx, my } = getCoords(event);

    if (drag_target === "lens") {
        lens_x = mx + offset.x;
        lens_y = my + offset.y;
    } else if (drag_target === "m1") {
        mirror_start.x = mx + offset.x;
        mirror_start.y = my + offset.y;
    } else if (drag_target === "m2") {
        mirror_end.x = mx + offset.x;
        mirror_end.y = my + offset.y;
    } else {
        var i = 1;
        for(const r of rays) {
            if(drag_target == ("r" + String(i))) {
                rays[i-1].pos.x = mx;
                rays[i-1].pos.y = my;
                return;
            }
            i+=1;
        }
    }
}

canvas.addEventListener("mousedown",handleStart);
canvas.addEventListener("mouseup",handleStop);
canvas.addEventListener("mousemove",handleMove);

canvas.addEventListener('touchstart', handleStart);
canvas.addEventListener('touchmove', handleMove);
canvas.addEventListener('touchend', handleStop);
canvas.addEventListener('touchcancel', handleStop)

function loop() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,900,600);

    // draw lens
    let lens_top = lens_y - lens_height / 2;
    let lens_bottom = lens_y + lens_height / 2;
    line("blue",lens_x,lens_top,lens_x,lens_bottom);

    // draw mirror
    line("white",mirror_start.x,mirror_start.y,mirror_end.x,mirror_end.y);
    circle("magenta",mirror_start.x,mirror_start.y,6);
    circle("magenta",mirror_end.x,mirror_end.y,6);

    let mirror_normal = get_mirror_normal(mirror_start, mirror_end);
    
    var i = -1;
    // process ray
    for (const r of rays) {
        i+=1;

        let ray_pos = r.pos;
        let ray_dir = r.dir;

        circle(r.color, ray_pos.x, ray_pos.y, 6);

        if(!rayStateControls[i].checked) continue;

        // Compute lens intersection
        let t_lens = (lens_x - ray_pos.x) / ray_dir.x;
        let lens_hit = add(ray_pos, mul(ray_dir, t_lens));

        let lens_top = lens_y - lens_height/2;
        let lens_bottom = lens_y + lens_height/2;

        if (t_lens > 0 && lens_top <= lens_hit.y && lens_hit.y <= lens_bottom) {
            // Draw ray to lens
            line(r.color, ray_pos.x, ray_pos.y, lens_hit.x, lens_hit.y);

            // Refracted direction
            let dy = lens_hit.y - lens_y;
            let new_dir = normalize(Vector2.new(1, -dy / lens_f));

            // Mirror check
            let mirror_hit = intersect_ray_with_segment(lens_hit, new_dir, mirror_start, mirror_end);
            let refracted_end = (mirror_hit.x || mirror_hit.y) ?
                mirror_hit :
                add(lens_hit, mul(new_dir, 500));

            line(r.color, lens_hit.x, lens_hit.y, refracted_end.x, refracted_end.y);

            if (mirror_hit.x || mirror_hit.y) {
                let out_dir = reflect(new_dir, mirror_normal);
                let reflected_end = add(mirror_hit, mul(out_dir, 400));
                line(r.color, mirror_hit.x, mirror_hit.y, reflected_end.x, reflected_end.y);
            }

        } else {
            // No lens hit → direct to mirror
            let mirror_hit = intersect_ray_with_segment(ray_pos, ray_dir, mirror_start, mirror_end);
            if (mirror_hit.x || mirror_hit.y) {
                line(r.color, ray_pos.x, ray_pos.y, mirror_hit.x, mirror_hit.y);
                let out_dir = reflect(ray_dir, mirror_normal);
                let reflected_end = add(mirror_hit, mul(out_dir, 400));
                line(r.color, mirror_hit.x, mirror_hit.y, reflected_end.x, reflected_end.y);
            } else {
                let endPoint = add(ray_pos, mul(ray_dir, 2000));
                line(r.color, ray_pos.x, ray_pos.y, endPoint.x, endPoint.y);
            }
        }
    }

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);