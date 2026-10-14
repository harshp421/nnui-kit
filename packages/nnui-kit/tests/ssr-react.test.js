import assert from 'node:assert';
import test from 'node:test';

test('SSR and Node Server Execution Safety Suite', async (t) => {
  await t.test('Root entry dist/index.js executes in pure Node environment without window/HTMLElement', async () => {
    // Ensure window is undefined
    assert.strictEqual(typeof window, 'undefined');
    const indexModule = await import('../dist/index.js');
    assert.ok(indexModule.BaseLightElement, 'BaseLightElement should export cleanly in Node');
    assert.ok(indexModule.elements, 'elements map should export in Node');
    assert.ok(typeof indexModule.register === 'function', 'register function should export in Node');
    assert.ok(typeof indexModule.toast === 'function', 'toast function should export in Node');
  });

  await t.test('Client entry dist/client.js safely no-ops on server during SSR', async () => {
    assert.strictEqual(typeof window, 'undefined');
    const clientModule = await import('../dist/client.js');
    assert.ok(clientModule.BaseLightElement, 'BaseLightElement should export in client.js');
    assert.ok(typeof clientModule.register === 'function', 'register should export in client.js');
  });

  await t.test('React entry dist/react.js loads and exports first-class wrapper components', async () => {
    const reactModule = await import('../dist/react.js');
    assert.ok(reactModule.Tabs, 'Tabs component should be exported');
    assert.ok(reactModule.DataGrid, 'DataGrid component should be exported');
    assert.ok(reactModule.Dialog, 'Dialog component should be exported');
    assert.ok(reactModule.Stepper, 'Stepper component should be exported');
    assert.ok(reactModule.Slider, 'Slider component should be exported');
    assert.ok(reactModule.ColorPicker, 'ColorPicker component should be exported');
    assert.ok(typeof reactModule.toast === 'function', 'toast should be exported');
    assert.ok(typeof reactModule.createReactComponent === 'function', 'createReactComponent factory should be exported');
  });
});
