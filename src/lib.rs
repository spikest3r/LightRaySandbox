use wasm_bindgen::prelude::*;
use std::f64;

#[wasm_bindgen]
pub struct Vector2 {
    pub x: f64,
    pub y: f64,
}

#[wasm_bindgen]
impl Vector2 {
    pub fn new(x: f64, y: f64) -> Vector2 {
        Vector2 {x: x, y: y}
    }
}

#[wasm_bindgen]
pub fn normalize(v: &Vector2) -> Vector2 {
    let x = v.x;
    let y = v.y;

    let l = f64::hypot(x, y);

    if l != 0.0 {
        Vector2 {x: (x / l), y: (y / l)}
    } else {
        Vector2 {x:0.0, y:0.0}
    }
}

#[wasm_bindgen]
pub fn dot(v1: &Vector2, v2: &Vector2) -> f64 {
    return v1.x * v2.x + v1.y * v2.y;
}

#[wasm_bindgen]
pub fn sub(v1: &Vector2, v2: &Vector2) -> Vector2 {
    return Vector2 {x:(v1.x - v2.x), y:(v1.y - v2.y)};
}

#[wasm_bindgen]
pub fn add(v1: &Vector2, v2: &Vector2) -> Vector2 {
    return Vector2 {x:(v1.x + v2.x), y:(v1.y + v2.y)};
}

#[wasm_bindgen]
pub fn mul(v: &Vector2, s: f64) -> Vector2 {
    return Vector2 {x:(v.x * s), y:(v.y * s)};
}

#[wasm_bindgen]
pub fn get_mirror_normal(m_start: &Vector2, m_end: &Vector2) -> Vector2 {
    let seg_vec: Vector2 = sub(m_end,m_start);
    let normal: Vector2 = normalize(&Vector2 {x: seg_vec.y, y: -seg_vec.x});
    return normal;
}

#[wasm_bindgen]
pub fn intersect_ray_with_segment(ray_start: &Vector2, ray_dir: &Vector2, seg_start: &Vector2, seg_end:&Vector2) -> Vector2 {
    let dx_seg = seg_end.x - seg_start.x;
    let dy_seg = seg_end.y - seg_start.y;
    
    let denom: f64 = ray_dir.x * dy_seg - ray_dir.y * dx_seg;

    if denom.abs() < 1e-6 {
        return Vector2 {x: 0.0, y:0.0};
    }

    let t_num = (seg_start.x - ray_start.x) * dy_seg - (seg_start.y - ray_start.y) * dx_seg;
    let t = t_num / denom;

    let u_num = (seg_start.x - ray_start.x) * ray_dir.y - (seg_start.y - ray_start.y) * ray_dir.x;
    let u = u_num / denom;

    if t > 1e-6 && (0.0 <= u && u <= 1.0) {
        return add(ray_start, &mul(ray_dir, t));
    }

    return Vector2 {x: 0.0, y:0.0};
}

#[wasm_bindgen]
pub fn reflect(dir_vec: &Vector2, normal: &Vector2) -> Vector2 {
    let dotp = dot(dir_vec,normal);
    return normalize(&sub(dir_vec,&mul(normal, 2.0*dotp)))
}

#[wasm_bindgen]
pub fn dist(v1: Vector2, v2: &Vector2) -> f64 {
    let dx = v2.x - v1.x;
    let dy = v2.y - v1.y;
    return f64::hypot(dx,dy);
}