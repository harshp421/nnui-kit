import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const jsonPath = path.join(rootDir, 'apps/docs/src/data/components-data.json');

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Helper to update code snippets for a component
function setSnippets(slug, { react, vue, svelte, raw }) {
  if (!data[slug]) {
    console.warn(`Warning: component ${slug} not found in components-data.json`);
    return;
  }
  if (react) data[slug].reactCode = react.trim();
  if (vue) data[slug].vueCode = vue.trim();
  if (svelte) data[slug].svelteCode = svelte.trim();
  if (raw) data[slug].rawCode = raw.trim();
}

// =========================================================================
// 1. ACCORDION
// =========================================================================
setSnippets('accordion', {
  react: `import React from 'react';
import 'nnuikit/css';
import { Accordion } from 'nnuikit/react';

export default function AccordionDemo() {
  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <Accordion.Item data-value="item-1">
        <Accordion.Trigger>
          <span>Is NNUI-KIT 100% Light-DOM?</span>
          <span data-part="indicator">▼</span>
        </Accordion.Trigger>
        <Accordion.Content>
          Yes! Zero Shadow DOM traps. Seamless global CSS cascade, native form participation, and sub-40 KB runtime.
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item data-value="item-2">
        <Accordion.Trigger>
          <span>How does state persistence work?</span>
          <span data-part="indicator">▼</span>
        </Accordion.Trigger>
        <Accordion.Content>
          Pass persist="url" or persist="local" to synchronize state with URL search parameters or storage automatically.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
import 'nnuikit/client';
</script>

<template>
  <ui-accordion type="single" collapsible default-value="item-1">
    <div data-part="item" data-value="item-1">
      <button type="button" data-part="trigger">
        <span>Is NNUI-KIT 100% Light-DOM?</span>
        <span data-part="indicator">▼</span>
      </button>
      <div data-part="content">
        Yes! Zero Shadow DOM traps. Seamless global CSS cascade, native form participation, and sub-40 KB runtime.
      </div>
    </div>
  </ui-accordion>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';
</script>

<ui-accordion type="single" collapsible default-value="item-1">
  <div data-part="item" data-value="item-1">
    <button type="button" data-part="trigger">
      <span>Is NNUI-KIT 100% Light-DOM?</span>
      <span data-part="indicator">▼</span>
    </button>
    <div data-part="content">
      Yes! Zero Shadow DOM traps. Seamless global CSS cascade, native form participation, and sub-40 KB runtime.
    </div>
  </div>
</ui-accordion>`
});

// =========================================================================
// 2. AI PROMPT BOX
// =========================================================================
setSnippets('ai-prompt-box', {
  react: `import React from 'react';
import 'nnuikit/css';
import { AiPromptBox, toast } from 'nnuikit/react';

export default function AiPromptBoxDemo() {
  const handleSubmit = (e) => {
    toast.success('Prompt dispatched', { description: e.detail.value });
  };

  return (
    <AiPromptBox
      persist="local"
      placeholder="Ask AI copilot or search code directives..."
      onSubmit={handleSubmit}
    />
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
import 'nnuikit/client';
import { toast } from 'nnuikit';

const handleSubmit = (e) => {
  toast.success('Prompt dispatched', { description: e.detail.value });
};
</script>

<template>
  <ui-ai-prompt-box
    persist="local"
    placeholder="Ask AI copilot or search code directives..."
    @submit="handleSubmit"
  />
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';
  import { toast } from 'nnuikit';

  function handleSubmit(e) {
    toast.success('Prompt dispatched', { description: e.detail.value });
  }
</script>

<ui-ai-prompt-box
  persist="local"
  placeholder="Ask AI copilot or search code directives..."
  onsubmit={handleSubmit}
/>`
});

// =========================================================================
// 3. ALERT
// =========================================================================
setSnippets('alert', {
  react: `import React from 'react';
import 'nnuikit/css';
import { Alert } from 'nnuikit/react';

export default function AlertDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Alert variant="info">
        <Alert.Title>System Notice</Alert.Title>
        <Alert.Description>
          NNUI-KIT executes entirely in the document Light DOM with zero shadow boundaries.
        </Alert.Description>
      </Alert>

      <Alert variant="success">
        <Alert.Title>Deployment Complete</Alert.Title>
        <Alert.Description>
          All 45 platform-native components compiled successfully with sub-40 KB runtime.
        </Alert.Description>
      </Alert>
    </div>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <div data-ui="alert" data-variant="info">
      <h5 data-part="alert-title">System Notice</h5>
      <div data-part="alert-description">
        NNUI-KIT executes entirely in the document Light DOM with zero shadow boundaries.
      </div>
    </div>
  </div>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
</script>

<div style="display: flex; flex-direction: column; gap: 1rem;">
  <div data-ui="alert" data-variant="info">
    <h5 data-part="alert-title">System Notice</h5>
    <div data-part="alert-description">
      NNUI-KIT executes entirely in the document Light DOM with zero shadow boundaries.
    </div>
  </div>
</div>`
});

// =========================================================================
// 4. AVATAR
// =========================================================================
setSnippets('avatar', {
  react: `import React from 'react';
import 'nnuikit/css';
import { Avatar } from 'nnuikit/react';

export default function AvatarDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="User avatar" size="md" />
      <Avatar fallback="HP" size="md" />
      <Avatar fallback="AI" size="lg" />
    </div>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
</script>

<template>
  <div style="display: flex; align-items: center; gap: 1rem;">
    <div data-ui="avatar" data-size="md">
      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="User avatar" data-part="image" />
    </div>
    <div data-ui="avatar" data-size="md">
      <span data-part="fallback">HP</span>
    </div>
  </div>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
</script>

<div style="display: flex; align-items: center; gap: 1rem;">
  <div data-ui="avatar" data-size="md">
    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="User avatar" data-part="image" />
  </div>
  <div data-ui="avatar" data-size="md">
    <span data-part="fallback">HP</span>
  </div>
</div>`
});

// =========================================================================
// 5. BADGE
// =========================================================================
setSnippets('badge', {
  react: `import React from 'react';
import 'nnuikit/css';
import { Badge } from 'nnuikit/react';

export default function BadgeDemo() {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Active</Badge>
      <Badge variant="destructive">Failed</Badge>
    </div>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
</script>

<template>
  <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
    <span data-ui="badge">Default</span>
    <span data-ui="badge" data-variant="secondary">Secondary</span>
    <span data-ui="badge" data-variant="outline">Outline</span>
    <span data-ui="badge" data-variant="success">Active</span>
  </div>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
</script>

<div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
  <span data-ui="badge">Default</span>
  <span data-ui="badge" data-variant="secondary">Secondary</span>
  <span data-ui="badge" data-variant="outline">Outline</span>
  <span data-ui="badge" data-variant="success">Active</span>
</div>`
});

// =========================================================================
// 6. BUTTON
// =========================================================================
setSnippets('button', {
  react: `import React from 'react';
import 'nnuikit/css';
import { Button, toast } from 'nnuikit/react';

export default function ButtonDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
      <Button variant="primary" onClick={() => toast.success('Primary clicked')}>
        Primary
      </Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
import { toast } from 'nnuikit';

const handleClick = () => {
  toast.success('Button clicked');
};
</script>

<template>
  <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
    <button type="button" data-ui="button" @click="handleClick">Primary</button>
    <button type="button" data-ui="button" data-variant="secondary">Secondary</button>
    <button type="button" data-ui="button" data-variant="outline">Outline</button>
    <button type="button" data-ui="button" data-variant="ghost">Ghost</button>
  </div>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import { toast } from 'nnuikit';

  function handleClick() {
    toast.success('Button clicked');
  }
</script>

<div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
  <button type="button" data-ui="button" onclick={handleClick}>Primary</button>
  <button type="button" data-ui="button" data-variant="secondary">Secondary</button>
  <button type="button" data-ui="button" data-variant="outline">Outline</button>
</div>`
});

// =========================================================================
// 7. CALENDAR
// =========================================================================
setSnippets('calendar', {
  react: `import React, { useState } from 'react';
import 'nnuikit/css';
import { Calendar } from 'nnuikit/react';

export default function CalendarDemo() {
  const [date, setDate] = useState('2026-10-28');

  return (
    <div style={{ maxWidth: 320 }}>
      <Calendar value={date} onChange={(e) => setDate(e.detail.value)} />
      <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--ui-text-muted)' }}>
        Selected: <strong>{date}</strong>
      </p>
    </div>
  );
}`,
  vue: `<script setup>
import { ref } from 'vue';
import 'nnuikit/css';
import 'nnuikit/client';

const selectedDate = ref('2026-10-28');
</script>

<template>
  <div style="max-width: 320px;">
    <ui-calendar :value="selectedDate" @change="(e) => selectedDate = e.detail.value" />
    <p style="margin-top: 0.75rem; font-size: 0.85rem; color: var(--ui-text-muted);">
      Selected: <strong>{{ selectedDate }}</strong>
    </p>
  </div>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';

  let selectedDate = $state('2026-10-28');
</script>

<div style="max-width: 320px;">
  <ui-calendar value={selectedDate} onchange={(e) => selectedDate = e.detail.value} />
  <p style="margin-top: 0.75rem; font-size: 0.85rem; color: var(--ui-text-muted);">
    Selected: <strong>{selectedDate}</strong>
  </p>
</div>`
});

// =========================================================================
// 8. CARD
// =========================================================================
setSnippets('card', {
  react: `import React from 'react';
import 'nnuikit/css';
import { Card, Button } from 'nnuikit/react';

export default function CardDemo() {
  return (
    <Card style={{ maxWidth: 420 }}>
      <Card.Header>
        <Card.Title>Autonomous Pipeline</Card.Title>
        <Card.Description>Cluster nodes orchestrated across 3 regions.</Card.Description>
      </Card.Header>
      <Card.Body>
        <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--ui-text-secondary)', lineHeight: 1.5 }}>
          Sub-40 KB runtime with live state synchronization and full Light-DOM CSS isolation.
        </p>
      </Card.Body>
      <Card.Footer style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <Button variant="secondary">Dismiss</Button>
        <Button variant="primary">Deploy Now</Button>
      </Card.Footer>
    </Card>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
</script>

<template>
  <div data-ui="card" style="max-width: 420px;">
    <div data-part="card-header">
      <h3 data-part="card-title">Autonomous Pipeline</h3>
      <p data-part="card-description">Cluster nodes orchestrated across 3 regions.</p>
    </div>
    <div data-part="card-content">
      <p style="margin: 0; font-size: 0.88rem; color: var(--ui-text-secondary); line-height: 1.5;">
        Sub-40 KB runtime with live state synchronization and full Light-DOM CSS isolation.
      </p>
    </div>
    <div data-part="card-footer" style="display: flex; justify-content: flex-end; gap: 0.75rem;">
      <button type="button" data-ui="button" data-variant="secondary">Dismiss</button>
      <button type="button" data-ui="button">Deploy Now</button>
    </div>
  </div>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
</script>

<div data-ui="card" style="max-width: 420px;">
  <div data-part="card-header">
    <h3 data-part="card-title">Autonomous Pipeline</h3>
    <p data-part="card-description">Cluster nodes orchestrated across 3 regions.</p>
  </div>
  <div data-part="card-content">
    <p style="margin: 0; font-size: 0.88rem; color: var(--ui-text-secondary); line-height: 1.5;">
      Sub-40 KB runtime with live state synchronization and full Light-DOM CSS isolation.
    </p>
  </div>
  <div data-part="card-footer" style="display: flex; justify-content: flex-end; gap: 0.75rem;">
    <button type="button" data-ui="button" data-variant="secondary">Dismiss</button>
    <button type="button" data-ui="button">Deploy Now</button>
  </div>
</div>`
});

// =========================================================================
// 9. CHECKBOX
// =========================================================================
setSnippets('checkbox', {
  react: `import React, { useState } from 'react';
import 'nnuikit/css';
import { Checkbox } from 'nnuikit/react';

export default function CheckboxDemo() {
  const [agreed, setAgreed] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Checkbox
        label="Accept production SLA agreements"
        description="Requires 99.99% uptime compliance across nodes"
        checked={agreed}
        onChange={(e) => setAgreed(e.target.checked)}
      />
    </div>
  );
}`,
  vue: `<script setup>
import { ref } from 'vue';
import 'nnuikit/css';

const agreed = ref(false);
</script>

<template>
  <label data-ui="checkbox">
    <input type="checkbox" v-model="agreed" />
    <span data-part="label">Accept production SLA agreements</span>
    <span data-part="description">Requires 99.99% uptime compliance across nodes</span>
  </label>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';

  let agreed = $state(false);
</script>

<label data-ui="checkbox">
  <input type="checkbox" bind:checked={agreed} />
  <span data-part="label">Accept production SLA agreements</span>
  <span data-part="description">Requires 99.99% uptime compliance across nodes</span>
</label>`
});

// =========================================================================
// 10. COLOR PICKER
// =========================================================================
setSnippets('color-picker', {
  react: `import React, { useState } from 'react';
import 'nnuikit/css';
import { ColorPicker } from 'nnuikit/react';

export default function ColorPickerDemo() {
  const [color, setColor] = useState('#8b5cf6');

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <ColorPicker value={color} onChange={(e) => setColor(e.detail.value)} />
      <span style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}>{color}</span>
    </div>
  );
}`,
  vue: `<script setup>
import { ref } from 'vue';
import 'nnuikit/css';
import 'nnuikit/client';

const color = ref('#8b5cf6');
</script>

<template>
  <div style="display: flex; align-items: center; gap: 1rem;">
    <ui-color-picker :value="color" @change="(e) => color = e.detail.value" />
    <span style="font-family: monospace;">{{ color }}</span>
  </div>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';

  let color = $state('#8b5cf6');
</script>

<div style="display: flex; align-items: center; gap: 1rem;">
  <ui-color-picker value={color} onchange={(e) => color = e.detail.value} />
  <span style="font-family: monospace;">{color}</span>
</div>`
});

// =========================================================================
// 11. COMBOBOX
// =========================================================================
setSnippets('combobox', {
  react: `import React, { useState } from 'react';
import 'nnuikit/css';
import { Combobox } from 'nnuikit/react';

export default function ComboboxDemo() {
  const [val, setVal] = useState('');

  return (
    <Combobox value={val} onChange={(e) => setVal(e.detail.value)} style={{ maxWidth: 300 }}>
      <Combobox.Input placeholder="Search framework..." />
      <Combobox.List>
        <Combobox.Item data-value="react">React 19</Combobox.Item>
        <Combobox.Item data-value="vue">Vue 3</Combobox.Item>
        <Combobox.Item data-value="svelte">Svelte 5</Combobox.Item>
        <Combobox.Item data-value="astro">Astro 5</Combobox.Item>
      </Combobox.List>
    </Combobox>
  );
}`,
  vue: `<script setup>
import { ref } from 'vue';
import 'nnuikit/css';
import 'nnuikit/client';

const selected = ref('');
</script>

<template>
  <ui-combobox :value="selected" @change="(e) => selected = e.detail.value" style="max-width: 300px;">
    <input data-part="input" placeholder="Search framework..." />
    <ul data-part="listbox">
      <li data-part="option" data-value="react">React 19</li>
      <li data-part="option" data-value="vue">Vue 3</li>
      <li data-part="option" data-value="svelte">Svelte 5</li>
    </ul>
  </ui-combobox>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';

  let selected = $state('');
</script>

<ui-combobox value={selected} onchange={(e) => selected = e.detail.value} style="max-width: 300px;">
  <input data-part="input" placeholder="Search framework..." />
  <ul data-part="listbox">
    <li data-part="option" data-value="react">React 19</li>
    <li data-part="option" data-value="vue">Vue 3</li>
    <li data-part="option" data-value="svelte">Svelte 5</li>
  </ul>
</ui-combobox>`
});

// =========================================================================
// 12. COMMAND PALETTE
// =========================================================================
setSnippets('command', {
  react: `import React from 'react';
import 'nnuikit/css';
import { Command, toast } from 'nnuikit/react';

export default function CommandDemo() {
  return (
    <Command onSelect={(e) => toast.info('Command selected: ' + e.detail.value)} style={{ maxWidth: 480 }}>
      <Command.Input placeholder="Type a command or search..." />
      <Command.List>
        <Command.Group heading="Actions">
          <Command.Item data-value="new-file">Create New File</Command.Item>
          <Command.Item data-value="copy-link">Copy Public Link</Command.Item>
        </Command.Group>
        <Command.Group heading="Settings">
          <Command.Item data-value="theme">Toggle Theme Mode</Command.Item>
          <Command.Item data-value="profile">Edit Profile</Command.Item>
        </Command.Group>
      </Command.List>
    </Command>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
import 'nnuikit/client';
import { toast } from 'nnuikit';

const handleSelect = (e) => {
  toast.info('Command selected: ' + e.detail.value);
};
</script>

<template>
  <ui-command @select="handleSelect" style="max-width: 480px;">
    <input data-part="input" placeholder="Type a command or search..." />
    <ul data-part="list">
      <div data-part="group" data-heading="Actions">
        <li data-part="item" data-value="new-file">Create New File</li>
        <li data-part="item" data-value="copy-link">Copy Public Link</li>
      </div>
    </ul>
  </ui-command>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';
  import { toast } from 'nnuikit';

  function handleSelect(e) {
    toast.info('Command selected: ' + e.detail.value);
  }
</script>

<ui-command onselect={handleSelect} style="max-width: 480px;">
  <input data-part="input" placeholder="Type a command or search..." />
  <ul data-part="list">
    <div data-part="group" data-heading="Actions">
      <li data-part="item" data-value="new-file">Create New File</li>
      <li data-part="item" data-value="copy-link">Copy Public Link</li>
    </div>
  </ul>
</ui-command>`
});

// =========================================================================
// 13. CONTEXT MENU
// =========================================================================
setSnippets('context-menu', {
  react: `import React from 'react';
import 'nnuikit/css';
import { ContextMenu, toast } from 'nnuikit/react';

export default function ContextMenuDemo() {
  return (
    <ContextMenu onSelect={(e) => toast.info('Action: ' + e.detail.value)}>
      <ContextMenu.Trigger style={{ padding: '3rem 2rem', border: '1px dashed var(--ui-border-default)', borderRadius: '8px', textAlign: 'center', userSelect: 'none' }}>
        Right-click inside this zone
      </ContextMenu.Trigger>
      <ContextMenu.Menu>
        <ContextMenu.Item data-value="reload">Reload Frame</ContextMenu.Item>
        <ContextMenu.Item data-value="copy">Copy Asset Link</ContextMenu.Item>
        <ContextMenu.Item data-value="inspect">Inspect AI Schema</ContextMenu.Item>
      </ContextMenu.Menu>
    </ContextMenu>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
import 'nnuikit/client';
import { toast } from 'nnuikit';

const handleSelect = (e) => {
  toast.info('Action: ' + e.detail.value);
};
</script>

<template>
  <ui-context-menu @select="handleSelect">
    <div data-part="trigger" style="padding: 3rem 2rem; border: 1px dashed var(--ui-border-default); border-radius: 8px; text-align: center;">
      Right-click inside this zone
    </div>
    <ul data-part="menu">
      <li data-part="item" data-value="reload">Reload Frame</li>
      <li data-part="item" data-value="copy">Copy Asset Link</li>
    </ul>
  </ui-context-menu>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';
  import { toast } from 'nnuikit';

  function handleSelect(e) {
    toast.info('Action: ' + e.detail.value);
  }
</script>

<ui-context-menu onselect={handleSelect}>
  <div data-part="trigger" style="padding: 3rem 2rem; border: 1px dashed var(--ui-border-default); border-radius: 8px; text-align: center;">
    Right-click inside this zone
  </div>
  <ul data-part="menu">
    <li data-part="item" data-value="reload">Reload Frame</li>
    <li data-part="item" data-value="copy">Copy Asset Link</li>
  </ul>
</ui-context-menu>`
});

// =========================================================================
// 14. DATA GRID
// =========================================================================
setSnippets('data-grid', {
  react: `import React, { useRef, useEffect } from 'react';
import 'nnuikit/css';
import { DataGrid } from 'nnuikit/react';

export default function DataGridDemo() {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    // Load 15,000 virtualized rows at 60 FPS
    const mockData = Array.from({ length: 15000 }, (_, i) => ({
      id: i + 1,
      ticker: \`SYM-\${(1000 + i % 500)}\`,
      price: (Math.random() * 500).toFixed(2),
      status: i % 3 === 0 ? 'Executed' : 'Pending'
    }));
    grid.setData(mockData);
  }, []);

  return (
    <DataGrid
      ref={gridRef}
      persist="url"
      sync="cross-tab"
      rowHeight={40}
      overscan={6}
      style={{ height: 420 }}
    />
  );
}`,
  vue: `<script setup>
import { onMounted, ref } from 'vue';
import 'nnuikit/css';
import 'nnuikit/client';

const gridRef = ref(null);

onMounted(() => {
  if (!gridRef.value) return;
  const mockData = Array.from({ length: 15000 }, (_, i) => ({
    id: i + 1,
    ticker: \`SYM-\${(1000 + i % 500)}\`,
    price: (Math.random() * 500).toFixed(2),
    status: i % 3 === 0 ? 'Executed' : 'Pending'
  }));
  gridRef.value.setData(mockData);
});
</script>

<template>
  <ui-data-grid
    ref="gridRef"
    persist="url"
    sync="cross-tab"
    row-height="40"
    overscan="6"
    style="height: 420px;"
  />
</template>`,
  svelte: `<script>
  import { onMount } from 'svelte';
  import 'nnuikit/css';
  import 'nnuikit/client';

  let gridEl;

  onMount(() => {
    if (!gridEl) return;
    const mockData = Array.from({ length: 15000 }, (_, i) => ({
      id: i + 1,
      ticker: \`SYM-\${(1000 + i % 500)}\`,
      price: (Math.random() * 500).toFixed(2),
      status: i % 3 === 0 ? 'Executed' : 'Pending'
    }));
    gridEl.setData(mockData);
  });
</script>

<ui-data-grid
  bind:this={gridEl}
  persist="url"
  sync="cross-tab"
  row-height="40"
  overscan="6"
  style="height: 420px;"
/>`
});

// =========================================================================
// 15. DATA TABLE
// =========================================================================
setSnippets('data-table', {
  react: `import React from 'react';
import 'nnuikit/css';
import { DataTable } from 'nnuikit/react';

export default function DataTableDemo() {
  return (
    <DataTable search filter sort pagination>
      <table data-part="table" className="ui-table">
        <thead>
          <tr>
            <th data-sort="name">Customer</th>
            <th data-sort="email">Email</th>
            <th data-sort="role">Role</th>
            <th data-sort="status">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jane Cooper</td>
            <td>jane@example.com</td>
            <td>Admin</td>
            <td><span data-ui="badge" data-variant="success">Active</span></td>
          </tr>
          <tr>
            <td>Cody Fisher</td>
            <td>cody@example.com</td>
            <td>Developer</td>
            <td><span data-ui="badge" data-variant="secondary">Review</span></td>
          </tr>
        </tbody>
      </table>
    </DataTable>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
import 'nnuikit/client';
</script>

<template>
  <ui-data-table search filter sort pagination>
    <table data-part="table" class="ui-table">
      <thead>
        <tr>
          <th data-sort="name">Customer</th>
          <th data-sort="email">Email</th>
          <th data-sort="role">Role</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Jane Cooper</td>
          <td>jane@example.com</td>
          <td>Admin</td>
        </tr>
      </tbody>
    </table>
  </ui-data-table>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';
</script>

<ui-data-table search filter sort pagination>
  <table data-part="table" class="ui-table">
    <thead>
      <tr>
        <th data-sort="name">Customer</th>
        <th data-sort="email">Email</th>
        <th data-sort="role">Role</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Jane Cooper</td>
        <td>jane@example.com</td>
        <td>Admin</td>
      </tr>
    </tbody>
  </table>
</ui-data-table>`
});

// =========================================================================
// 16. DATE PICKER
// =========================================================================
setSnippets('date-picker', {
  react: `import React, { useState } from 'react';
import 'nnuikit/css';
import { DatePicker } from 'nnuikit/react';

export default function DatePickerDemo() {
  const [date, setDate] = useState('2026-10-28');

  return (
    <DatePicker value={date} onChange={(e) => setDate(e.detail.value)}>
      <DatePicker.Trigger>
        {date ? \`Selected: \${date}\` : 'Pick a date...'}
      </DatePicker.Trigger>
    </DatePicker>
  );
}`,
  vue: `<script setup>
import { ref } from 'vue';
import 'nnuikit/css';
import 'nnuikit/client';

const date = ref('2026-10-28');
</script>

<template>
  <ui-date-picker :value="date" @change="(e) => date = e.detail.value">
    <button type="button" data-part="trigger" data-ui="button" data-variant="outline">
      {{ date ? \`Selected: \${date}\` : 'Pick a date...' }}
    </button>
  </ui-date-picker>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';

  let date = $state('2026-10-28');
</script>

<ui-date-picker value={date} onchange={(e) => date = e.detail.value}>
  <button type="button" data-part="trigger" data-ui="button" data-variant="outline">
    {date ? \`Selected: \${date}\` : 'Pick a date...'}
  </button>
</ui-date-picker>`
});

// =========================================================================
// 17. DATE RANGE PICKER
// =========================================================================
setSnippets('date-range-picker', {
  react: `import React from 'react';
import 'nnuikit/css';
import { DateRangePicker, toast } from 'nnuikit/react';

export default function DateRangePickerDemo() {
  return (
    <DateRangePicker
      persist="local"
      onChange={(e) => toast.info(\`Range: \${e.detail.start} → \${e.detail.end}\`)}
    />
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
import 'nnuikit/client';
import { toast } from 'nnuikit';

const handleRange = (e) => {
  toast.info(\`Range: \${e.detail.start} → \${e.detail.end}\`);
};
</script>

<template>
  <ui-date-range-picker persist="local" @change="handleRange" />
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';
  import { toast } from 'nnuikit';

  function handleRange(e) {
    toast.info(\`Range: \${e.detail.start} → \${e.detail.end}\`);
  }
</script>

<ui-date-range-picker persist="local" onchange={handleRange} />`
});

// =========================================================================
// 18. DIALOG
// =========================================================================
setSnippets('dialog', {
  react: `import React, { useState } from 'react';
import 'nnuikit/css';
import { Dialog, Button } from 'nnuikit/react';

export default function DialogDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open Modal Dialog
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Content>
          <div data-part="dialog-header">
            <Dialog.Title>Edit User Profile</Dialog.Title>
            <Dialog.Description>Configure your account and team permissions.</Dialog.Description>
          </div>
          <div data-part="dialog-body" style={{ margin: '1.25rem 0' }}>
            <label data-ui="label" style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
            <input data-ui="input" defaultValue="Harsh Parmar" style={{ width: '100%' }} />
          </div>
          <div data-part="dialog-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setOpen(false)}>Save Changes</Button>
          </div>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}`,
  vue: `<script setup>
import { ref } from 'vue';
import 'nnuikit/css';
import 'nnuikit/client';

const isOpen = ref(false);
</script>

<template>
  <div>
    <button type="button" data-ui="button" @click="isOpen = true">Open Modal Dialog</button>

    <ui-dialog :open="isOpen">
      <dialog data-part="dialog">
        <div data-part="dialog-header">
          <h3 data-part="dialog-title">Edit User Profile</h3>
          <p data-part="dialog-description">Configure your account and team permissions.</p>
        </div>
        <div data-part="dialog-footer" style="display: flex; justify-content: flex-end; gap: 0.75rem;">
          <button type="button" data-ui="button" data-variant="secondary" data-part="close" @click="isOpen = false">Cancel</button>
          <button type="button" data-ui="button" data-part="close" @click="isOpen = false">Save Changes</button>
        </div>
      </dialog>
    </ui-dialog>
  </div>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';

  let isOpen = $state(false);
</script>

<div>
  <button type="button" data-ui="button" onclick={() => isOpen = true}>Open Modal Dialog</button>

  <ui-dialog open={isOpen}>
    <dialog data-part="dialog">
      <div data-part="dialog-header">
        <h3 data-part="dialog-title">Edit User Profile</h3>
        <p data-part="dialog-description">Configure your account and team permissions.</p>
      </div>
      <div data-part="dialog-footer" style="display: flex; justify-content: flex-end; gap: 0.75rem;">
        <button type="button" data-ui="button" data-variant="secondary" data-part="close" onclick={() => isOpen = false}>Cancel</button>
        <button type="button" data-ui="button" data-part="close" onclick={() => isOpen = false}>Save Changes</button>
      </div>
    </dialog>
  </ui-dialog>
</div>`
});

// =========================================================================
// 19. DROPDOWN
// =========================================================================
setSnippets('dropdown', {
  react: `import React from 'react';
import 'nnuikit/css';
import { Dropdown, Button, toast } from 'nnuikit/react';

export default function DropdownDemo() {
  return (
    <Dropdown onSelect={(e) => toast.info('Selected: ' + e.detail.value)}>
      <Dropdown.Trigger as={Button} variant="outline">
        Options ▾
      </Dropdown.Trigger>
      <Dropdown.Menu>
        <Dropdown.Item data-value="edit">Edit Project</Dropdown.Item>
        <Dropdown.Item data-value="duplicate">Duplicate Branch</Dropdown.Item>
        <Dropdown.Item data-value="delete" style={{ color: 'var(--ui-color-danger-500)' }}>Archive</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
import 'nnuikit/client';
import { toast } from 'nnuikit';

const handleSelect = (e) => {
  toast.info('Selected: ' + e.detail.value);
};
</script>

<template>
  <ui-dropdown @select="handleSelect">
    <button type="button" data-part="trigger" data-ui="button" data-variant="outline">
      Options ▾
    </button>
    <ul data-part="menu">
      <li data-part="item" data-value="edit">Edit Project</li>
      <li data-part="item" data-value="duplicate">Duplicate Branch</li>
    </ul>
  </ui-dropdown>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';
  import { toast } from 'nnuikit';

  function handleSelect(e) {
    toast.info('Selected: ' + e.detail.value);
  }
</script>

<ui-dropdown onselect={handleSelect}>
  <button type="button" data-part="trigger" data-ui="button" data-variant="outline">
    Options ▾
  </button>
  <ul data-part="menu">
    <li data-part="item" data-value="edit">Edit Project</li>
    <li data-part="item" data-value="duplicate">Duplicate Branch</li>
  </ul>
</ui-dropdown>`
});

// =========================================================================
// 20. FILE UPLOAD
// =========================================================================
setSnippets('file-upload', {
  react: `import React from 'react';
import 'nnuikit/css';
import { FileUpload, toast } from 'nnuikit/react';

export default function FileUploadDemo() {
  return (
    <FileUpload
      maxFiles={3}
      maxSize="10MB"
      accept="image/*,.pdf"
      onChange={(e) => toast.success(\`\${e.detail.files.length} file(s) staged\`)}
      style={{ maxWidth: 500 }}
    >
      <FileUpload.Dropzone>
        <p style={{ margin: 0, fontWeight: 600 }}>Drag & drop files or click to browse</p>
        <span style={{ fontSize: '0.8rem', color: 'var(--ui-text-muted)' }}>Images and PDFs up to 10MB</span>
      </FileUpload.Dropzone>
    </FileUpload>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
import 'nnuikit/client';
import { toast } from 'nnuikit';

const handleChange = (e) => {
  toast.success(\`\${e.detail.files.length} file(s) staged\`);
};
</script>

<template>
  <ui-file-upload max-files="3" max-size="10MB" @change="handleChange" style="max-width: 500px;">
    <div data-part="dropzone">
      <p style="margin: 0; font-weight: 600;">Drag & drop files or click to browse</p>
      <span style="font-size: 0.8rem; color: var(--ui-text-muted);">Images and PDFs up to 10MB</span>
    </div>
  </ui-file-upload>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';
  import { toast } from 'nnuikit';

  function handleChange(e) {
    toast.success(\`\${e.detail.files.length} file(s) staged\`);
  }
</script>

<ui-file-upload max-files="3" max-size="10MB" onchange={handleChange} style="max-width: 500px;">
  <div data-part="dropzone">
    <p style="margin: 0; font-weight: 600;">Drag & drop files or click to browse</p>
    <span style="font-size: 0.8rem; color: var(--ui-text-muted);">Images and PDFs up to 10MB</span>
  </div>
</ui-file-upload>`
});

// =========================================================================
// 21. INPUT
// =========================================================================
setSnippets('input', {
  react: `import React, { useState } from 'react';
import 'nnuikit/css';
import { Input } from 'nnuikit/react';

export default function InputDemo() {
  const [val, setVal] = useState('');

  return (
    <div style={{ maxWidth: 360, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input
        placeholder="Search documentation..."
        value={val}
        onChange={(e) => setVal(e.target.value)}
        kbd="⌘K"
        clearable
        onClear={() => setVal('')}
      />
    </div>
  );
}`,
  vue: `<script setup>
import { ref } from 'vue';
import 'nnuikit/css';

const query = ref('');
</script>

<template>
  <div style="max-width: 360px;">
    <div data-part="input-group">
      <input data-ui="input" type="search" placeholder="Search documentation..." v-model="query" />
      <span data-part="input-icon-right">
        <kbd class="ui-kbd">⌘K</kbd>
      </span>
    </div>
  </div>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';

  let query = $state('');
</script>

<div style="max-width: 360px;">
  <div data-part="input-group">
    <input data-ui="input" type="search" placeholder="Search documentation..." bind:value={query} />
    <span data-part="input-icon-right">
      <kbd class="ui-kbd">⌘K</kbd>
    </span>
  </div>
</div>`
});

// =========================================================================
// 22. NAVIGATION MENU
// =========================================================================
setSnippets('navigation-menu', {
  react: `import React from 'react';
import 'nnuikit/css';
import { NavigationMenu } from 'nnuikit/react';

export default function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenu.Item>
        <NavigationMenu.Trigger>Platform</NavigationMenu.Trigger>
        <NavigationMenu.Content style={{ padding: '1rem', width: 300 }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Core Modules</h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ui-text-muted)' }}>
            Light-DOM universal primitives across React, Vue, Svelte, and Astro.
          </p>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
    </NavigationMenu>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
import 'nnuikit/client';
</script>

<template>
  <ui-navigation-menu>
    <div data-part="item">
      <button type="button" data-part="trigger">Platform</button>
      <div data-part="content" style="padding: 1rem; width: 300px;">
        <h4 style="margin: 0 0 0.5rem;">Core Modules</h4>
        <p style="margin: 0; font-size: 0.85rem; color: var(--ui-text-muted);">
          Light-DOM universal primitives across modern frameworks.
        </p>
      </div>
    </div>
  </ui-navigation-menu>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';
</script>

<ui-navigation-menu>
  <div data-part="item">
    <button type="button" data-part="trigger">Platform</button>
    <div data-part="content" style="padding: 1rem; width: 300px;">
      <h4 style="margin: 0 0 0.5rem;">Core Modules</h4>
      <p style="margin: 0; font-size: 0.85rem; color: var(--ui-text-muted);">
        Light-DOM universal primitives across modern frameworks.
      </p>
    </div>
  </div>
</ui-navigation-menu>`
});

// =========================================================================
// 23. OTP INPUT
// =========================================================================
setSnippets('otp-input', {
  react: `import React, { useState } from 'react';
import 'nnuikit/css';
import { OtpInput, toast } from 'nnuikit/react';

export default function OtpInputDemo() {
  const [pin, setPin] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <OtpInput
        length={6}
        value={pin}
        onChange={(e) => {
          setPin(e.detail.value);
          if (e.detail.value.length === 6) toast.success('2FA Verified: ' + e.detail.value);
        }}
      />
    </div>
  );
}`,
  vue: `<script setup>
import { ref } from 'vue';
import 'nnuikit/css';
import 'nnuikit/client';
import { toast } from 'nnuikit';

const pin = ref('');
const handleChange = (e) => {
  pin.value = e.detail.value;
  if (e.detail.value.length === 6) toast.success('2FA Verified: ' + e.detail.value);
};
</script>

<template>
  <ui-otp-input length="6" :value="pin" @change="handleChange" />
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';
  import { toast } from 'nnuikit';

  let pin = $state('');

  function handleChange(e) {
    pin = e.detail.value;
    if (e.detail.value.length === 6) toast.success('2FA Verified: ' + e.detail.value);
  }
</script>

<ui-otp-input length="6" value={pin} onchange={handleChange} />`
});

// =========================================================================
// 24. POPOVER
// =========================================================================
setSnippets('popover', {
  react: `import React from 'react';
import 'nnuikit/css';
import { Popover, Button } from 'nnuikit/react';

export default function PopoverDemo() {
  return (
    <Popover>
      <Popover.Trigger as={Button} variant="outline">
        Open Dimensions
      </Popover.Trigger>
      <Popover.Content style={{ padding: '1rem', width: 260 }}>
        <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.95rem' }}>Dimensions</h4>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ui-text-muted)' }}>
          Top-layer popover anchored with native CSS Anchor Positioning.
        </p>
      </Popover.Content>
    </Popover>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
import 'nnuikit/client';
</script>

<template>
  <ui-popover>
    <button type="button" data-part="trigger" data-ui="button" data-variant="outline">
      Open Dimensions
    </button>
    <div data-part="popover" style="padding: 1rem; width: 260px;">
      <h4 style="margin: 0 0 0.5rem; font-size: 0.95rem;">Dimensions</h4>
      <p style="margin: 0; font-size: 0.85rem; color: var(--ui-text-muted);">
        Top-layer popover anchored with native CSS Anchor Positioning.
      </p>
    </div>
  </ui-popover>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';
</script>

<ui-popover>
  <button type="button" data-part="trigger" data-ui="button" data-variant="outline">
    Open Dimensions
  </button>
  <div data-part="popover" style="padding: 1rem; width: 260px;">
    <h4 style="margin: 0 0 0.5rem; font-size: 0.95rem;">Dimensions</h4>
    <p style="margin: 0; font-size: 0.85rem; color: var(--ui-text-muted);">
      Top-layer popover anchored with native CSS Anchor Positioning.
    </p>
  </div>
</ui-popover>`
});

// =========================================================================
// 25. PROGRESS
// =========================================================================
setSnippets('progress', {
  react: `import React from 'react';
import 'nnuikit/css';
import { Progress } from 'nnuikit/react';

export default function ProgressDemo() {
  return (
    <div style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Progress value={65} max={100} />
      <span style={{ fontSize: '0.85rem', color: 'var(--ui-text-muted)' }}>Syncing records: 65%</span>
    </div>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
</script>

<template>
  <div style="max-width: 400px;">
    <div data-ui="progress" role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100">
      <div data-part="indicator" style="width: 65%;"></div>
    </div>
  </div>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
</script>

<div style="max-width: 400px;">
  <div data-ui="progress" role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100">
    <div data-part="indicator" style="width: 65%;"></div>
  </div>
</div>`
});

// =========================================================================
// 26. RESIZABLE
// =========================================================================
setSnippets('resizable', {
  react: `import React from 'react';
import 'nnuikit/css';
import { Resizable } from 'nnuikit/react';

export default function ResizableDemo() {
  return (
    <Resizable orientation="horizontal" style={{ height: 260, border: '1px solid var(--ui-border-default)', borderRadius: '8px' }}>
      <Resizable.Panel defaultSize={40} style={{ padding: '1rem' }}>
        <strong>Navigation Explorer</strong>
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel defaultSize={60} style={{ padding: '1rem' }}>
        <strong>Active Editor Surface</strong>
      </Resizable.Panel>
    </Resizable>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
import 'nnuikit/client';
</script>

<template>
  <ui-resizable orientation="horizontal" style="height: 260px; border: 1px solid var(--ui-border-default); border-radius: 8px;">
    <div data-part="panel" style="padding: 1rem; width: 40%;">
      <strong>Navigation Explorer</strong>
    </div>
    <div data-part="handle"></div>
    <div data-part="panel" style="padding: 1rem; flex: 1;">
      <strong>Active Editor Surface</strong>
    </div>
  </ui-resizable>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';
</script>

<ui-resizable orientation="horizontal" style="height: 260px; border: 1px solid var(--ui-border-default); border-radius: 8px;">
  <div data-part="panel" style="padding: 1rem; width: 40%;">
    <strong>Navigation Explorer</strong>
  </div>
  <div data-part="handle"></div>
  <div data-part="panel" style="padding: 1rem; flex: 1;">
    <strong>Active Editor Surface</strong>
  </div>
</ui-resizable>`
});

// =========================================================================
// 27. SEGMENTED CONTROL
// =========================================================================
setSnippets('segmented-control', {
  react: `import React, { useState } from 'react';
import 'nnuikit/css';
import { SegmentedControl } from 'nnuikit/react';

export default function SegmentedControlDemo() {
  const [role, setRole] = useState('developer');

  return (
    <SegmentedControl value={role} onChange={(e) => setRole(e.detail.value)}>
      <SegmentedControl.Segment data-value="viewer">Viewer</SegmentedControl.Segment>
      <SegmentedControl.Segment data-value="developer">Developer</SegmentedControl.Segment>
      <SegmentedControl.Segment data-value="admin">Admin</SegmentedControl.Segment>
    </SegmentedControl>
  );
}`,
  vue: `<script setup>
import { ref } from 'vue';
import 'nnuikit/css';
import 'nnuikit/client';

const role = ref('developer');
</script>

<template>
  <ui-segmented-control :value="role" @change="(e) => role = e.detail.value">
    <button data-part="segment" data-value="viewer">Viewer</button>
    <button data-part="segment" data-value="developer">Developer</button>
    <button data-part="segment" data-value="admin">Admin</button>
  </ui-segmented-control>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';

  let role = $state('developer');
</script>

<ui-segmented-control value={role} onchange={(e) => role = e.detail.value}>
  <button data-part="segment" data-value="viewer">Viewer</button>
  <button data-part="segment" data-value="developer">Developer</button>
  <button data-part="segment" data-value="admin">Admin</button>
</ui-segmented-control>`
});

// =========================================================================
// 28. SELECT
// =========================================================================
setSnippets('select', {
  react: `import React, { useState } from 'react';
import 'nnuikit/css';
import { Select } from 'nnuikit/react';

export default function SelectDemo() {
  const [framework, setFramework] = useState('react');

  return (
    <Select value={framework} onChange={(e) => setFramework(e.detail.value)} style={{ maxWidth: 260 }}>
      <Select.Trigger>
        <Select.Value placeholder="Select target framework" />
      </Select.Trigger>
      <Select.List>
        <Select.Item data-value="react">React 19</Select.Item>
        <Select.Item data-value="vue">Vue 3</Select.Item>
        <Select.Item data-value="svelte">Svelte 5</Select.Item>
        <Select.Item data-value="astro">Astro 5</Select.Item>
      </Select.List>
    </Select>
  );
}`,
  vue: `<script setup>
import { ref } from 'vue';
import 'nnuikit/css';
import 'nnuikit/client';

const framework = ref('react');
</script>

<template>
  <ui-select :value="framework" @change="(e) => framework = e.detail.value" style="max-width: 260px;">
    <button type="button" data-part="trigger">
      <span data-part="value">Select target framework</span>
    </button>
    <ul data-part="listbox">
      <li data-part="option" data-value="react">React 19</li>
      <li data-part="option" data-value="vue">Vue 3</li>
      <li data-part="option" data-value="svelte">Svelte 5</li>
    </ul>
  </ui-select>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';

  let framework = $state('react');
</script>

<ui-select value={framework} onchange={(e) => framework = e.detail.value} style="max-width: 260px;">
  <button type="button" data-part="trigger">
    <span data-part="value">Select target framework</span>
  </button>
  <ul data-part="listbox">
    <li data-part="option" data-value="react">React 19</li>
    <li data-part="option" data-value="vue">Vue 3</li>
    <li data-part="option" data-value="svelte">Svelte 5</li>
  </ul>
</ui-select>`
});

// =========================================================================
// 29. SEPARATOR
// =========================================================================
setSnippets('separator', {
  react: `import React from 'react';
import 'nnuikit/css';
import { Separator } from 'nnuikit/react';

export default function SeparatorDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 400 }}>
      <div>Section Alpha</div>
      <Separator orientation="horizontal" />
      <div>Section Beta</div>
      <Separator orientation="horizontal" label="OR CONTINUE WITH" />
      <div>Section Gamma</div>
    </div>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 400px;">
    <div>Section Alpha</div>
    <hr data-ui="separator" />
    <div>Section Beta</div>
    <div data-ui="separator"><span data-part="label">OR CONTINUE WITH</span></div>
    <div>Section Gamma</div>
  </div>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
</script>

<div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 400px;">
  <div>Section Alpha</div>
  <hr data-ui="separator" />
  <div>Section Beta</div>
  <div data-ui="separator"><span data-part="label">OR CONTINUE WITH</span></div>
  <div>Section Gamma</div>
</div>`
});

// =========================================================================
// 30. SHEET
// =========================================================================
setSnippets('sheet', {
  react: `import React, { useState } from 'react';
import 'nnuikit/css';
import { Sheet, Button } from 'nnuikit/react';

export default function SheetDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="outline" onClick={() => setOpen(true)}>Open Sliding Sheet</Button>
      <Sheet open={open} onOpenChange={setOpen} side="right">
        <Sheet.Content style={{ padding: '2rem', width: 340 }}>
          <h3 style={{ margin: '0 0 0.5rem' }}>Configuration Drawer</h3>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--ui-text-muted)' }}>
            Sliding sheet using top-layer HTML dialog and physics spring easing.
          </p>
        </Sheet.Content>
      </Sheet>
    </div>
  );
}`,
  vue: `<script setup>
import { ref } from 'vue';
import 'nnuikit/css';
import 'nnuikit/client';

const isOpen = ref(false);
</script>

<template>
  <div>
    <button type="button" data-ui="button" data-variant="outline" @click="isOpen = true">Open Sliding Sheet</button>
    <ui-sheet :open="isOpen" side="right">
      <div data-part="content" style="padding: 2rem; width: 340px;">
        <h3 style="margin: 0 0 0.5rem;">Configuration Drawer</h3>
        <p style="margin: 0; font-size: 0.88rem; color: var(--ui-text-muted);">
          Sliding sheet using top-layer HTML dialog and physics spring easing.
        </p>
      </div>
    </ui-sheet>
  </div>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';

  let isOpen = $state(false);
</script>

<div>
  <button type="button" data-ui="button" data-variant="outline" onclick={() => isOpen = true}>Open Sliding Sheet</button>
  <ui-sheet open={isOpen} side="right">
    <div data-part="content" style="padding: 2rem; width: 340px;">
      <h3 style="margin: 0 0 0.5rem;">Configuration Drawer</h3>
      <p style="margin: 0; font-size: 0.88rem; color: var(--ui-text-muted);">
        Sliding sheet using top-layer HTML dialog and physics spring easing.
      </p>
    </div>
  </ui-sheet>
</div>`
});

// =========================================================================
// 31. SKELETON
// =========================================================================
setSnippets('skeleton', {
  react: `import React from 'react';
import 'nnuikit/css';
import { Skeleton } from 'nnuikit/react';

export default function SkeletonDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: 360 }}>
      <Skeleton circle width={48} height={48} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <Skeleton height={18} width="80%" />
        <Skeleton height={14} width="50%" />
      </div>
    </div>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
</script>

<template>
  <div style="display: flex; align-items: center; gap: 1rem; max-width: 360px;">
    <div data-ui="skeleton" class="ui-skeleton--circle" style="width: 48px; height: 48px; border-radius: 50%;"></div>
    <div style="display: flex; flex-direction: column; gap: 0.5rem; flex: 1;">
      <div data-ui="skeleton" style="height: 18px; width: 80%;"></div>
      <div data-ui="skeleton" style="height: 14px; width: 50%;"></div>
    </div>
  </div>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
</script>

<div style="display: flex; align-items: center; gap: 1rem; max-width: 360px;">
  <div data-ui="skeleton" class="ui-skeleton--circle" style="width: 48px; height: 48px; border-radius: 50%;"></div>
  <div style="display: flex; flex-direction: column; gap: 0.5rem; flex: 1;">
    <div data-ui="skeleton" style="height: 18px; width: 80%;"></div>
    <div data-ui="skeleton" style="height: 14px; width: 50%;"></div>
  </div>
</div>`
});

// =========================================================================
// 32. SLIDER
// =========================================================================
setSnippets('slider', {
  react: `import React, { useState } from 'react';
import 'nnuikit/css';
import { Slider } from 'nnuikit/react';

export default function SliderDemo() {
  const [val, setVal] = useState(50);

  return (
    <div style={{ maxWidth: 320 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
        <span>Volume</span>
        <strong>{val}%</strong>
      </div>
      <Slider min={0} max={100} value={val} onChange={(e) => setVal(e.detail.value)} />
    </div>
  );
}`,
  vue: `<script setup>
import { ref } from 'vue';
import 'nnuikit/css';
import 'nnuikit/client';

const volume = ref(50);
</script>

<template>
  <div style="max-width: 320px;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.85rem;">
      <span>Volume</span>
      <strong>{{ volume }}%</strong>
    </div>
    <ui-slider min="0" max="100" :value="volume" @change="(e) => volume = e.detail.value" />
  </div>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';

  let volume = $state(50);
</script>

<div style="max-width: 320px;">
  <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.85rem;">
    <span>Volume</span>
    <strong>{volume}%</strong>
  </div>
  <ui-slider min="0" max="100" value={volume} onchange={(e) => volume = e.detail.value} />
</div>`
});

// =========================================================================
// 33. STEPPER
// =========================================================================
setSnippets('stepper', {
  react: `import React, { useRef } from 'react';
import 'nnuikit/css';
import { Stepper, Button } from 'nnuikit/react';

export default function StepperDemo() {
  const stepperRef = useRef(null);

  return (
    <div style={{ maxWidth: 640 }}>
      <Stepper ref={stepperRef} activeStep={1} persist="local" sync="cross-tab">
        <ol data-part="steplist">
          <li data-part="step" data-step="1">
            <div data-part="indicator">1</div>
            <div data-part="content">
              <div data-part="title">Model</div>
              <div data-part="description">LLM Backbone</div>
            </div>
          </li>
          <li data-part="step" data-step="2">
            <div data-part="indicator">2</div>
            <div data-part="content">
              <div data-part="title">Capabilities</div>
              <div data-part="description">Tools & MCP</div>
            </div>
          </li>
          <li data-part="step" data-step="3">
            <div data-part="indicator">3</div>
            <div data-part="content">
              <div data-part="title">Launch</div>
              <div data-part="description">Deployment</div>
            </div>
          </li>
        </ol>

        <div data-part="panel" data-step="1">
          <h4>Configure Model Engine</h4>
          <p style={{ color: 'var(--ui-text-muted)', fontSize: '0.9rem' }}>Select inference parameters and system prompt.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button onClick={() => stepperRef.current?.next()}>Next Step →</Button>
          </div>
        </div>

        <div data-part="panel" data-step="2">
          <h4>Assign Tools</h4>
          <p style={{ color: 'var(--ui-text-muted)', fontSize: '0.9rem' }}>Configure MCP sidecars and sandbox execution.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="outline" onClick={() => stepperRef.current?.prev()}>← Back</Button>
            <Button onClick={() => stepperRef.current?.next()}>Next Step →</Button>
          </div>
        </div>

        <div data-part="panel" data-step="3">
          <h4>Pipeline Ready</h4>
          <p style={{ color: 'var(--ui-text-muted)', fontSize: '0.9rem' }}>Cluster ready for high-throughput invocation.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="outline" onClick={() => stepperRef.current?.prev()}>← Back</Button>
            <Button variant="secondary" onClick={() => stepperRef.current?.goToStep(1)}>↺ Restart</Button>
          </div>
        </div>
      </Stepper>
    </div>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
import 'nnuikit/client';
</script>

<template>
  <ui-stepper id="agent-stepper" active-step="1" persist="local" sync="cross-tab" style="max-width: 640px;">
    <ol data-part="steplist">
      <li data-part="step" data-step="1">
        <div data-part="indicator">1</div>
        <div data-part="content"><div data-part="title">Model</div></div>
      </li>
      <li data-part="step" data-step="2">
        <div data-part="indicator">2</div>
        <div data-part="content"><div data-part="title">Tools</div></div>
      </li>
    </ol>
    <div data-part="panel" data-step="1">
      <p>Configure model directives.</p>
      <button type="button" class="ui-button" onclick="document.getElementById('agent-stepper').next()">Next →</button>
    </div>
    <div data-part="panel" data-step="2">
      <p>Capabilities configured.</p>
      <button type="button" class="ui-button" onclick="document.getElementById('agent-stepper').prev()">← Back</button>
    </div>
  </ui-stepper>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';
</script>

<ui-stepper id="agent-stepper" active-step="1" persist="local" sync="cross-tab" style="max-width: 640px;">
  <ol data-part="steplist">
    <li data-part="step" data-step="1">
      <div data-part="indicator">1</div>
      <div data-part="content"><div data-part="title">Model</div></div>
    </li>
    <li data-part="step" data-step="2">
      <div data-part="indicator">2</div>
      <div data-part="content"><div data-part="title">Tools</div></div>
    </li>
  </ol>
  <div data-part="panel" data-step="1">
    <p>Configure model directives.</p>
    <button type="button" class="ui-button" onclick="document.getElementById('agent-stepper').next()">Next →</button>
  </div>
  <div data-part="panel" data-step="2">
    <p>Capabilities configured.</p>
    <button type="button" class="ui-button" onclick="document.getElementById('agent-stepper').prev()">← Back</button>
  </div>
</ui-stepper>`
});

// =========================================================================
// 34. SWITCH
// =========================================================================
setSnippets('switch', {
  react: `import React, { useState } from 'react';
import 'nnuikit/css';
import { Switch } from 'nnuikit/react';

export default function SwitchDemo() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Switch
        label="Airplane mode and radio telemetry"
        checked={enabled}
        onChange={(e) => setEnabled(e.target.checked)}
      />
    </div>
  );
}`,
  vue: `<script setup>
import { ref } from 'vue';
import 'nnuikit/css';

const isEnabled = ref(true);
</script>

<template>
  <label data-ui="switch">
    <input type="checkbox" role="switch" v-model="isEnabled" />
    <span data-part="thumb"></span>
    <span data-part="label">Airplane mode and radio telemetry</span>
  </label>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';

  let isEnabled = $state(true);
</script>

<label data-ui="switch">
  <input type="checkbox" role="switch" bind:checked={isEnabled} />
  <span data-part="thumb"></span>
  <span data-part="label">Airplane mode and radio telemetry</span>
</label>`
});

// =========================================================================
// 35. TABLE
// =========================================================================
setSnippets('table', {
  react: `import React from 'react';
import 'nnuikit/css';
import { Table, Badge } from 'nnuikit/react';

export default function TableDemo() {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Service</Table.Head>
          <Table.Head>Region</Table.Head>
          <Table.Head>Status</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Inference Worker</Table.Cell>
          <Table.Cell>us-east-1</Table.Cell>
          <Table.Cell><Badge variant="success">Healthy</Badge></Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Vector Storage</Table.Cell>
          <Table.Cell>eu-central-1</Table.Cell>
          <Table.Cell><Badge variant="success">Healthy</Badge></Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
</script>

<template>
  <table data-ui="table" class="ui-table">
    <thead>
      <tr>
        <th>Service</th>
        <th>Region</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Inference Worker</td>
        <td>us-east-1</td>
        <td><span data-ui="badge" data-variant="success">Healthy</span></td>
      </tr>
    </tbody>
  </table>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
</script>

<table data-ui="table" class="ui-table">
  <thead>
    <tr>
      <th>Service</th>
      <th>Region</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Inference Worker</td>
      <td>us-east-1</td>
      <td><span data-ui="badge" data-variant="success">Healthy</span></td>
    </tr>
  </tbody>
</table>`
});

// =========================================================================
// 36. TABS
// =========================================================================
setSnippets('tabs', {
  react: `import React, { useState } from 'react';
import 'nnuikit/css';
import { Tabs } from 'nnuikit/react';

export default function TabsDemo() {
  const [tab, setTab] = useState('account');

  return (
    <Tabs value={tab} persist="url" onChange={(e) => setTab(e.detail.value)} style={{ maxWidth: 480 }}>
      <Tabs.List>
        <Tabs.Tab data-value="account">Account</Tabs.Tab>
        <Tabs.Tab data-value="password">Password</Tabs.Tab>
        <Tabs.Tab data-value="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel data-value="account">
        Manage personal account credentials and organization profile.
      </Tabs.Panel>
      <Tabs.Panel data-value="password">
        Configure 2FA hardware keys and session revocation rules.
      </Tabs.Panel>
      <Tabs.Panel data-value="settings">
        Customize real-time telemetry streaming and notification alerts.
      </Tabs.Panel>
    </Tabs>
  );
}`,
  vue: `<script setup>
import { ref } from 'vue';
import 'nnuikit/css';
import 'nnuikit/client';

const activeTab = ref('account');
</script>

<template>
  <ui-tabs :value="activeTab" persist="url" @change="(e) => activeTab = e.detail.value" style="max-width: 480px;">
    <div data-part="tablist">
      <button data-part="tab" data-value="account">Account</button>
      <button data-part="tab" data-value="password">Password</button>
    </div>
    <div data-part="tabpanel" data-value="account">
      Manage personal account credentials and organization profile.
    </div>
    <div data-part="tabpanel" data-value="password">
      Configure 2FA hardware keys and session revocation rules.
    </div>
  </ui-tabs>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';

  let activeTab = $state('account');
</script>

<ui-tabs value={activeTab} persist="url" onchange={(e) => activeTab = e.detail.value} style="max-width: 480px;">
  <div data-part="tablist">
    <button data-part="tab" data-value="account">Account</button>
    <button data-part="tab" data-value="password">Password</button>
  </div>
  <div data-part="tabpanel" data-value="account">
    Manage personal account credentials and organization profile.
  </div>
  <div data-part="tabpanel" data-value="password">
    Configure 2FA hardware keys and session revocation rules.
  </div>
</ui-tabs>`
});

// =========================================================================
// 37. TAGS INPUT
// =========================================================================
setSnippets('tags-input', {
  react: `import React, { useState } from 'react';
import 'nnuikit/css';
import { TagsInput } from 'nnuikit/react';

export default function TagsInputDemo() {
  const [tags, setTags] = useState(['react', 'web-components', 'light-dom']);

  return (
    <div style={{ maxWidth: 420 }}>
      <TagsInput value={tags} onChange={(e) => setTags(e.detail.value)} />
      <span style={{ fontSize: '0.8rem', color: 'var(--ui-text-muted)', marginTop: '0.5rem', display: 'block' }}>
        Press Enter or comma to add tags.
      </span>
    </div>
  );
}`,
  vue: `<script setup>
import { ref } from 'vue';
import 'nnuikit/css';
import 'nnuikit/client';

const tags = ref(['react', 'web-components']);
</script>

<template>
  <div style="max-width: 420px;">
    <ui-tags-input :value="tags" @change="(e) => tags = e.detail.value" />
  </div>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';

  let tags = $state(['react', 'web-components']);
</script>

<div style="max-width: 420px;">
  <ui-tags-input value={tags} onchange={(e) => tags = e.detail.value} />
</div>`
});

// =========================================================================
// 38. TOAST
// =========================================================================
setSnippets('toast', {
  react: `import React from 'react';
import 'nnuikit/css';
import { Toaster, Button, toast } from 'nnuikit/react';

export default function ToastDemo() {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
      <Toaster position="bottom-right" />
      <Button variant="primary" onClick={() => toast.success('Deployment live', { description: 'All nodes synchronized.' })}>
        Trigger Success Toast
      </Button>
      <Button variant="outline" onClick={() => toast.error('Connection timeout', { description: 'Retrying handshake.' })}>
        Trigger Error Toast
      </Button>
    </div>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
import 'nnuikit/client';
import { toast } from 'nnuikit';

const showToast = () => {
  toast.success('Deployment live', { description: 'All nodes synchronized.' });
};
</script>

<template>
  <div>
    <ui-toaster position="bottom-right" />
    <button type="button" data-ui="button" @click="showToast">Trigger Toast</button>
  </div>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';
  import { toast } from 'nnuikit';

  function showToast() {
    toast.success('Deployment live', { description: 'All nodes synchronized.' });
  }
</script>

<div>
  <ui-toaster position="bottom-right" />
  <button type="button" data-ui="button" onclick={showToast}>Trigger Toast</button>
</div>`
});

// =========================================================================
// 39. TOOLTIP
// =========================================================================
setSnippets('tooltip', {
  react: `import React from 'react';
import 'nnuikit/css';
import { Tooltip, Button } from 'nnuikit/react';

export default function TooltipDemo() {
  return (
    <Tooltip>
      <Tooltip.Trigger as={Button} variant="outline">
        Hover over me
      </Tooltip.Trigger>
      <Tooltip.Content>
        Anchored hint with zero shadow DOM barriers.
      </Tooltip.Content>
    </Tooltip>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
import 'nnuikit/client';
</script>

<template>
  <ui-tooltip>
    <button type="button" data-part="trigger" data-ui="button" data-variant="outline">
      Hover over me
    </button>
    <div data-part="content">
      Anchored hint with zero shadow DOM barriers.
    </div>
  </ui-tooltip>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';
</script>

<ui-tooltip>
  <button type="button" data-part="trigger" data-ui="button" data-variant="outline">
    Hover over me
  </button>
  <div data-part="content">
    Anchored hint with zero shadow DOM barriers.
  </div>
</ui-tooltip>`
});

// =========================================================================
// 40. TREE VIEW
// =========================================================================
setSnippets('tree-view', {
  react: `import React from 'react';
import 'nnuikit/css';
import { TreeView, toast } from 'nnuikit/react';

export default function TreeViewDemo() {
  return (
    <TreeView onSelect={(e) => toast.info('Selected file: ' + e.detail.id)} style={{ maxWidth: 300 }}>
      <TreeView.Item data-id="src" data-expanded="true">
        <span>📁 src</span>
        <ul data-part="group">
          <TreeView.Item data-id="index.ts">📄 index.ts</TreeView.Item>
          <TreeView.Item data-id="styles.css">🎨 styles.css</TreeView.Item>
        </ul>
      </TreeView.Item>
      <TreeView.Item data-id="package.json">📦 package.json</TreeView.Item>
    </TreeView>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
import 'nnuikit/client';
import { toast } from 'nnuikit';

const handleSelect = (e) => {
  toast.info('Selected file: ' + e.detail.id);
};
</script>

<template>
  <ui-tree-view @select="handleSelect" style="max-width: 300px;">
    <li data-part="item" data-id="src" data-expanded="true">
      <span>📁 src</span>
      <ul data-part="group">
        <li data-part="item" data-id="index.ts">📄 index.ts</li>
      </ul>
    </li>
  </ui-tree-view>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
  import 'nnuikit/client';
  import { toast } from 'nnuikit';

  function handleSelect(e) {
    toast.info('Selected file: ' + e.detail.id);
  }
</script>

<ui-tree-view onselect={handleSelect} style="max-width: 300px;">
  <li data-part="item" data-id="src" data-expanded="true">
    <span>📁 src</span>
    <ul data-part="group">
      <li data-part="item" data-id="index.ts">📄 index.ts</li>
    </ul>
  </li>
</ui-tree-view>`
});

// =========================================================================
// 41. SPINNER
// =========================================================================
setSnippets('spinner', {
  react: `import React from 'react';
import 'nnuikit/css';
import { Spinner } from 'nnuikit/react';

export default function SpinnerDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
</script>

<template>
  <div style="display: flex; align-items: center; gap: 1.5rem;">
    <div data-ui="spinner" data-size="sm"></div>
    <div data-ui="spinner"></div>
    <div data-ui="spinner" data-size="lg"></div>
  </div>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
</script>

<div style="display: flex; align-items: center; gap: 1.5rem;">
  <div data-ui="spinner" data-size="sm"></div>
  <div data-ui="spinner"></div>
  <div data-ui="spinner" data-size="lg"></div>
</div>`
});

// =========================================================================
// 42. EMPTY STATE
// =========================================================================
setSnippets('empty', {
  react: `import React from 'react';
import 'nnuikit/css';
import { Empty, Button } from 'nnuikit/react';

export default function EmptyDemo() {
  return (
    <Empty style={{ border: '1px dashed var(--ui-border-default)', borderRadius: '12px', padding: '3rem 2rem' }}>
      <Empty.Icon style={{ fontSize: '2.5rem' }}>📂</Empty.Icon>
      <Empty.Title>No Deployments Found</Empty.Title>
      <Empty.Description>
        Get started by creating your first edge deployment pipeline.
      </Empty.Description>
      <Empty.Action style={{ marginTop: '1rem' }}>
        <Button variant="primary">Create Pipeline</Button>
      </Empty.Action>
    </Empty>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
</script>

<template>
  <div data-ui="empty" style="border: 1px dashed var(--ui-border-default); border-radius: 12px; padding: 3rem 2rem;">
    <div data-part="empty-icon" style="font-size: 2.5rem;">📂</div>
    <h4 data-part="empty-title">No Deployments Found</h4>
    <p data-part="empty-description">Get started by creating your first edge deployment pipeline.</p>
    <div data-part="empty-action" style="margin-top: 1rem;">
      <button type="button" data-ui="button">Create Pipeline</button>
    </div>
  </div>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
</script>

<div data-ui="empty" style="border: 1px dashed var(--ui-border-default); border-radius: 12px; padding: 3rem 2rem;">
  <div data-part="empty-icon" style="font-size: 2.5rem;">📂</div>
  <h4 data-part="empty-title">No Deployments Found</h4>
  <p data-part="empty-description">Get started by creating your first edge deployment pipeline.</p>
  <div data-part="empty-action" style="margin-top: 1rem;">
    <button type="button" data-ui="button">Create Pipeline</button>
  </div>
</div>`
});

// =========================================================================
// 43. STACK
// =========================================================================
setSnippets('stack', {
  react: `import React from 'react';
import 'nnuikit/css';
import { Stack, Button } from 'nnuikit/react';

export default function StackDemo() {
  return (
    <Stack direction="row" gap="md" align="center">
      <Button variant="primary">Save Changes</Button>
      <Button variant="secondary">Cancel</Button>
    </Stack>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
</script>

<template>
  <div data-ui="stack" data-direction="row" data-gap="md" data-align="center">
    <button type="button" data-ui="button">Save Changes</button>
    <button type="button" data-ui="button" data-variant="secondary">Cancel</button>
  </div>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
</script>

<div data-ui="stack" data-direction="row" data-gap="md" data-align="center">
  <button type="button" data-ui="button">Save Changes</button>
  <button type="button" data-ui="button" data-variant="secondary">Cancel</button>
</div>`
});

// =========================================================================
// 44. GRID
// =========================================================================
setSnippets('grid', {
  react: `import React from 'react';
import 'nnuikit/css';
import { Grid, Card } from 'nnuikit/react';

export default function GridDemo() {
  return (
    <Grid cols={3} gap="md">
      <Card><Card.Body>Metric 1: 99.9%</Card.Body></Card>
      <Card><Card.Body>Metric 2: 12ms</Card.Body></Card>
      <Card><Card.Body>Metric 3: 0 Errors</Card.Body></Card>
    </Grid>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
</script>

<template>
  <div data-ui="grid" data-cols="3" data-gap="md">
    <div data-ui="card"><div data-part="card-content">Metric 1: 99.9%</div></div>
    <div data-ui="card"><div data-part="card-content">Metric 2: 12ms</div></div>
    <div data-ui="card"><div data-part="card-content">Metric 3: 0 Errors</div></div>
  </div>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
</script>

<div data-ui="grid" data-cols="3" data-gap="md">
  <div data-ui="card"><div data-part="card-content">Metric 1: 99.9%</div></div>
  <div data-ui="card"><div data-part="card-content">Metric 2: 12ms</div></div>
  <div data-ui="card"><div data-part="card-content">Metric 3: 0 Errors</div></div>
</div>`
});

// =========================================================================
// 45. CONTAINER
// =========================================================================
setSnippets('container', {
  react: `import React from 'react';
import 'nnuikit/css';
import { Container } from 'nnuikit/react';

export default function ContainerDemo() {
  return (
    <Container size="lg" style={{ padding: '2rem 1.5rem' }}>
      <h1>Dashboard Viewport</h1>
      <p style={{ color: 'var(--ui-text-muted)' }}>Constrained responsive max-width container.</p>
    </Container>
  );
}`,
  vue: `<script setup>
import 'nnuikit/css';
</script>

<template>
  <div data-ui="container" data-size="lg" style="padding: 2rem 1.5rem;">
    <h1>Dashboard Viewport</h1>
    <p style="color: var(--ui-text-muted);">Constrained responsive max-width container.</p>
  </div>
</template>`,
  svelte: `<script>
  import 'nnuikit/css';
</script>

<div data-ui="container" data-size="lg" style="padding: 2rem 1.5rem;">
  <h1>Dashboard Viewport</h1>
  <p style="color: var(--ui-text-muted);">Constrained responsive max-width container.</p>
</div>`
});

// Save updated JSON
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`✓ Successfully updated all 45 component snippets in ${jsonPath}!`);
