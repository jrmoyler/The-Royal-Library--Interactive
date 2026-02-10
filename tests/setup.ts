import '@testing-library/jest-dom/vitest';

// Mock WebGL context for Three.js in test environment
class MockWebGLRenderingContext {
  canvas = { width: 800, height: 600 };
  getExtension() { return null; }
  getParameter(p: number) { return p === 7938 ? 'WebGL 2.0' : 1; }
  createShader() { return {}; }
  shaderSource() {}
  compileShader() {}
  getShaderParameter() { return true; }
  createProgram() { return {}; }
  attachShader() {}
  linkProgram() {}
  getProgramParameter() { return true; }
  useProgram() {}
  createBuffer() { return {}; }
  bindBuffer() {}
  bufferData() {}
  enableVertexAttribArray() {}
  vertexAttribPointer() {}
  createTexture() { return {}; }
  bindTexture() {}
  texImage2D() {}
  texParameteri() {}
  enable() {}
  disable() {}
  clear() {}
  viewport() {}
  clearColor() {}
  getShaderInfoLog() { return ''; }
  getProgramInfoLog() { return ''; }
  getActiveAttrib() { return { name: '', type: 0, size: 0 }; }
  getActiveUniform() { return { name: '', type: 0, size: 0 }; }
  getAttribLocation() { return 0; }
  getUniformLocation() { return {}; }
  drawArrays() {}
  drawElements() {}
  createFramebuffer() { return {}; }
  bindFramebuffer() {}
  framebufferTexture2D() {}
  checkFramebufferStatus() { return 36053; }
  createRenderbuffer() { return {}; }
  bindRenderbuffer() {}
  renderbufferStorage() {}
  framebufferRenderbuffer() {}
  deleteTexture() {}
  deleteBuffer() {}
  deleteFramebuffer() {}
  deleteRenderbuffer() {}
  pixelStorei() {}
  generateMipmap() {}
  blendFunc() {}
  depthFunc() {}
  depthMask() {}
  colorMask() {}
  scissor() {}
  activeTexture() {}
  uniform1f() {}
  uniform1i() {}
  uniform2f() {}
  uniform3f() {}
  uniform4f() {}
  uniformMatrix3fv() {}
  uniformMatrix4fv() {}
}

HTMLCanvasElement.prototype.getContext = function (type: string) {
  if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
    return new MockWebGLRenderingContext() as any;
  }
  return null;
} as any;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (index: number) => Object.keys(store)[index] || null,
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
