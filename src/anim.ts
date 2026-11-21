export type Pt = [number, number];
export const prog = (g: number, a: number, b: number) => Math.min(1, Math.max(0, (g - a) / (b - a)));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerp2 = (a: Pt, b: Pt, t: number): Pt => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const backOut = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
export const pop = (g: number, a: number, d = 0.35) => backOut(prog(g, a, a + d));
// a থেকে b পর্যন্ত দৃশ্যমান: পপ-ইন, শেষে ছোট হয়ে মিলিয়ে যায়
export const vis = (g: number, a: number, b: number, d = 0.3) => pop(g, a, d) * (1 - easeOut(prog(g, b - 0.25, b)));
export const inWin = (g: number, w: number[][]) => w.some(([a, b]) => g >= a && g < b);
