let wasm;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}
/**
 * @param {Vector2} v
 * @returns {Vector2}
 */
export function normalize(v) {
    _assertClass(v, Vector2);
    const ret = wasm.normalize(v.__wbg_ptr);
    return Vector2.__wrap(ret);
}

/**
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @returns {number}
 */
export function dot(v1, v2) {
    _assertClass(v1, Vector2);
    _assertClass(v2, Vector2);
    const ret = wasm.dot(v1.__wbg_ptr, v2.__wbg_ptr);
    return ret;
}

/**
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @returns {Vector2}
 */
export function sub(v1, v2) {
    _assertClass(v1, Vector2);
    _assertClass(v2, Vector2);
    const ret = wasm.sub(v1.__wbg_ptr, v2.__wbg_ptr);
    return Vector2.__wrap(ret);
}

/**
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @returns {Vector2}
 */
export function add(v1, v2) {
    _assertClass(v1, Vector2);
    _assertClass(v2, Vector2);
    const ret = wasm.add(v1.__wbg_ptr, v2.__wbg_ptr);
    return Vector2.__wrap(ret);
}

/**
 * @param {Vector2} v
 * @param {number} s
 * @returns {Vector2}
 */
export function mul(v, s) {
    _assertClass(v, Vector2);
    const ret = wasm.mul(v.__wbg_ptr, s);
    return Vector2.__wrap(ret);
}

/**
 * @param {Vector2} m_start
 * @param {Vector2} m_end
 * @returns {Vector2}
 */
export function get_mirror_normal(m_start, m_end) {
    _assertClass(m_start, Vector2);
    _assertClass(m_end, Vector2);
    const ret = wasm.get_mirror_normal(m_start.__wbg_ptr, m_end.__wbg_ptr);
    return Vector2.__wrap(ret);
}

/**
 * @param {Vector2} ray_start
 * @param {Vector2} ray_dir
 * @param {Vector2} seg_start
 * @param {Vector2} seg_end
 * @returns {Vector2}
 */
export function intersect_ray_with_segment(ray_start, ray_dir, seg_start, seg_end) {
    _assertClass(ray_start, Vector2);
    _assertClass(ray_dir, Vector2);
    _assertClass(seg_start, Vector2);
    _assertClass(seg_end, Vector2);
    const ret = wasm.intersect_ray_with_segment(ray_start.__wbg_ptr, ray_dir.__wbg_ptr, seg_start.__wbg_ptr, seg_end.__wbg_ptr);
    return Vector2.__wrap(ret);
}

/**
 * @param {Vector2} dir_vec
 * @param {Vector2} normal
 * @returns {Vector2}
 */
export function reflect(dir_vec, normal) {
    _assertClass(dir_vec, Vector2);
    _assertClass(normal, Vector2);
    const ret = wasm.reflect(dir_vec.__wbg_ptr, normal.__wbg_ptr);
    return Vector2.__wrap(ret);
}

/**
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @returns {number}
 */
export function dist(v1, v2) {
    _assertClass(v1, Vector2);
    _assertClass(v2, Vector2);
    const ret = wasm.dist(v1.__wbg_ptr, v2.__wbg_ptr);
    return ret;
}

const Vector2Finalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_vector2_free(ptr >>> 0, 1));

export class Vector2 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Vector2.prototype);
        obj.__wbg_ptr = ptr;
        Vector2Finalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        Vector2Finalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_vector2_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get x() {
        const ret = wasm.__wbg_get_vector2_x(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set x(arg0) {
        wasm.__wbg_set_vector2_x(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get y() {
        const ret = wasm.__wbg_get_vector2_y(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set y(arg0) {
        wasm.__wbg_set_vector2_y(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} x
     * @param {number} y
     * @returns {Vector2}
     */
    static new(x, y) {
        const ret = wasm.vector2_new(x, y);
        return Vector2.__wrap(ret);
    }
}
if (Symbol.dispose) Vector2.prototype[Symbol.dispose] = Vector2.prototype.free;

const EXPECTED_RESPONSE_TYPES = new Set(['basic', 'cors', 'default']);

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                const validResponse = module.ok && EXPECTED_RESPONSE_TYPES.has(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg___wbindgen_throw_b855445ff6a94295 = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_externrefs;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };

    return imports;
}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('light_sandbox_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
