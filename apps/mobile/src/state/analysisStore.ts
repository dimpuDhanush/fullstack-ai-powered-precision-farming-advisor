export type Analysis = any;

let latest: Analysis | null = null;

export const analysisStore = {
  setLatest(a: Analysis) {
    latest = a;
  },
  getLatest() {
    return latest;
  },
};
