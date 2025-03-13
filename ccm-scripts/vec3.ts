export class Vec3 {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static ONES = new Vec3(1, 1, 1);
    static ZEROS = new Vec3(0, 0, 0);
    static UP = new Vec3(0, 1, 0);
    static DOWN = new Vec3(0, -1, 0);

    static from(value: { x: number; y: number; z: number }): Vec3 {
        return new Vec3(value.x, value.y, value.z);
    }
    static random(): Vec3 {
        return new Vec3(random(-1, 1), random(-1, 1), random(-1, 1));
    }

    copy(): Vec3 {
        return new Vec3(this.x, this.y, this.z);
    }
    apply(callback: (value: number) => number): Vec3 {
        return new Vec3(callback(this.x), callback(this.y), callback(this.z));
    }

    toString(): string {
        const rounded = this.apply((v) => round(v, 1));
        return `Vec3(${rounded.x}, ${rounded.y}, ${rounded.z})`;
    }
    toArray(): [number, number, number] {
        return [this.x, this.y, this.z];
    }

    toCommandPosition(): string {
        const pos = this.apply((v) => round(v, 2));
        return `${pos.x} ${pos.y} ${pos.z}`;
    }
    toIntCommandPosition(): string {
        const pos = this.apply(Math.floor);
        return `${pos.x} ${pos.y} ${pos.z}`;
    }

    add(vec: Vec3): Vec3 {
        return new Vec3(this.x + vec.x, this.y + vec.y, this.z + vec.z);
    }
    minus(vec: Vec3): Vec3 {
        return new Vec3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
    }
    multiply(vec: Vec3): Vec3 {
        return new Vec3(this.x * vec.x, this.y * vec.y, this.z * vec.z);
    }
    divide(vec: Vec3): Vec3 {
        return new Vec3(this.x / vec.x, this.y / vec.y, this.z / vec.z);
    }
    multiplyBy(factor: number): Vec3 {
        return new Vec3(this.x * factor, this.y * factor, this.z * factor);
    }
    divideBy(factor: number): Vec3 {
        return new Vec3(this.x / factor, this.y / factor, this.z / factor);
    }

    equals(other: Vec3): boolean {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }
    almostEquals(other: Vec3): boolean {
        return (
            almostEquals(this.x, other.x) &&
            almostEquals(this.y, other.y) &&
            almostEquals(this.z, other.z)
        );
    }

    magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    normalise(): Vec3 {
        return this.divideBy(this.magnitude());
    }
    normaliseTo(factor: number): Vec3 {
        return this.divideBy(this.magnitude()).multiplyBy(factor);
    }

    directionTo(target: Vec3): Vec3 {
        return target.minus(this).normalise();
    }
    distanceTo(vec: Vec3): number {
        const a = Math.abs(this.x - vec.x);
        const b = Math.abs(this.y - vec.y);
        const c = Math.abs(this.z - vec.z);
        return Math.sqrt(a * a + b * b + c * c);
    }
}

export class Vec3Mutable extends Vec3 {
    apply_inplace(callback: (value: number) => number) {
        this.x = callback(this.x);
        this.y = callback(this.y);
        this.z = callback(this.z);
    }

    add_inplace(vec: Vec3) {
        this.x += vec.x;
        this.y += vec.y;
        this.z += vec.z;
    }
    minus_inplace(vec: Vec3) {
        this.x -= vec.x;
        this.y -= vec.y;
        this.z -= vec.z;
    }
    multiply_inplace(vec: Vec3) {
        this.x *= vec.x;
        this.y *= vec.y;
        this.z *= vec.z;
    }
    divide_inplace(vec: Vec3) {
        this.x *= vec.x;
        this.y *= vec.y;
        this.z *= vec.z;
    }
    multiplyBy_inplace(factor: number) {
        this.x *= factor;
        this.y *= factor;
        this.z *= factor;
    }
    divideBy_inplace(factor: number) {
        this.x /= factor;
        this.y /= factor;
        this.z /= factor;
    }

    normalise_inplace() {
        this.divideBy_inplace(this.magnitude());
    }
    normaliseTo_inplace(factor: number) {
        this.divideBy_inplace(this.magnitude());
        this.multiplyBy_inplace(factor);
    }
}

const round = (v: number, decimals: number = 0) => {
    const factor = 10 ** decimals;
    return Math.round(v * factor) / factor;
};

function random(min: number, max: number | undefined = undefined) {
    if (max === undefined) return Math.random() * min;
    const range = max - min;
    return min + Math.random() * range;
}

const EPSILON = 0.000001;
const almostEquals = (a: number, b: number, epsilon: number = EPSILON) => {
    return Math.abs(a - b) < epsilon;
};
