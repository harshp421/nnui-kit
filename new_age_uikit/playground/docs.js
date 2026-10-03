import '../src/index.js';
import { initThemeCustomizer } from './theme-customizer.js';
import { initGlobalSearch } from './command-search.js';

/**
 * Documentation Interactive Logic (Shadcn Style)
 */

const FRAMEWORK_STEPS = {
  nextjs: {
    step1Title: 'Create Next.js Project',
    step1Desc: 'Start with Next.js 14/15 App Router using TypeScript and Tailwind CSS.',
    step1Code: 'npx create-next-app@latest my-app --typescript --tailwind --eslint',
    step1File: 'Terminal',

    step2Title: 'Install NNUI-KIT',
    step2Desc: 'Install the core universal Light-DOM package.',
    step2Code: 'npm install nnui-kit',
    step2File: 'Terminal',

    step3Title: 'Import Styles in Root Layout',
    step3Desc: 'Add the universal stylesheet and custom element registration in app/layout.tsx.',
    step3Code: `import 'nnui-kit/css';
import 'nnui-kit'; // Auto-registers <nnui-*> and <ui-*> custom elements
import './globals.css';

export const metadata = {
  title: 'My NNUI App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`,
    step3File: 'app/layout.tsx',

    step4Title: 'Configure Cascade Layers in CSS',
    step4Desc: 'Ensure Tailwind utilities override library defaults cleanly without !important.',
    step4Code: `@import 'nnui-kit/css';

@tailwind base;
@tailwind components;
@tailwind utilities;`,
    step4File: 'app/globals.css',

    step5Title: 'Use Your First Component',
    step5Desc: 'Use standard JSX custom element tags with zero wrapper overhead.',
    step5Code: `'use client';
import { useState } from 'react';

export default function Page() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      <nnui-tabs value={activeTab} onChange={(e: any) => setActiveTab(e.detail.value)}>
        <div data-part="tablist">
          <button data-part="tab" data-value="overview">Overview</button>
          <button data-part="tab" data-value="analytics">Analytics</button>
          <button data-part="tab" data-value="settings">Settings</button>
        </div>
        <div data-part="tabpanel" data-value="overview">Overview content goes here.</div>
        <div data-part="tabpanel" data-value="analytics">Analytics telemetry goes here.</div>
        <div data-part="tabpanel" data-value="settings">Settings preferences go here.</div>
      </nnui-tabs>
    </div>
  );
}`,
    step5File: 'app/page.tsx'
  },

  vite: {
    step1Title: 'Create Vite Project',
    step1Desc: 'Scaffold a React, Vue, or Svelte project with Vite.',
    step1Code: 'npm create vite@latest my-app -- --template react-ts',
    step1File: 'Terminal',

    step2Title: 'Install NNUI-KIT',
    step2Desc: 'Install the universal package.',
    step2Code: 'npm install nnui-kit',
    step2File: 'Terminal',

    step3Title: 'Import in Main Entrypoint',
    step3Desc: 'Import the universal stylesheet and components in src/main.tsx or main.ts.',
    step3Code: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'nnui-kit/css';
import 'nnui-kit'; // Registers all custom elements

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
    step3File: 'src/main.tsx',

    step4Title: 'Configure Vue (if using Vue 3)',
    step4Desc: 'Tell the Vue compiler that tags starting with nnui- and ui- are custom elements.',
    step4Code: `// vite.config.ts (Only needed for Vue 3 projects)
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('nnui-') || tag.startsWith('ui-')
        }
      }
    })
  ]
});`,
    step4File: 'vite.config.ts',

    step5Title: 'Render Component',
    step5Desc: 'Drop any component directly into your template.',
    step5Code: `export function App() {
  return (
    <div className="card-container">
      <nnui-combobox onChange={(e: any) => console.log(e.detail.value)}>
        <div data-part="input-wrapper">
          <input data-part="input" placeholder="Search tech..." />
          <span data-part="toggle-icon">▼</span>
        </div>
        <ul data-part="listbox">
          <li data-part="option" data-value="vite">Vite</li>
          <li data-part="option" data-value="react">React 19</li>
          <li data-part="option" data-value="vue">Vue 3</li>
        </ul>
      </nnui-combobox>
    </div>
  );
}`,
    step5File: 'src/App.tsx'
  },

  astro: {
    step1Title: 'Create Astro Project',
    step1Desc: 'Scaffold your zero-JS server-rendered Astro site.',
    step1Code: 'npm create astro@latest my-astro-site',
    step1File: 'Terminal',

    step2Title: 'Install NNUI-KIT',
    step2Desc: 'Install the zero-dependency runtime.',
    step2Code: 'npm install nnui-kit',
    step2File: 'Terminal',

    step3Title: 'Add to Layout',
    step3Desc: 'Import the CSS in your Astro layout frontmatter.',
    step3Code: `---
// src/layouts/Layout.astro
import 'nnui-kit/css';
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Astro + NNUI</title>
    <!-- Core micro-enhancers script (< 4KB) -->
    <script>
      import 'nnui-kit';
    </script>
  </head>
  <body>
    <slot />
  </body>
</html>`,
    step3File: 'src/layouts/Layout.astro',

    step4Title: 'Zero-JS First Paint',
    step4Desc: 'Components render clean semantic HTML on the server, crawling 100% instantly.',
    step4Code: `---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
---

<Layout>
  <main>
    <!-- Native Tier 0 Card (Zero JavaScript Required) -->
    <div data-ui="card">
      <div data-part="card-header">
        <h3 data-part="card-title">Server Rendered Card</h3>
      </div>
      <div data-part="card-body">
        Fully indexable by search engine bots before hydration.
      </div>
      <div data-part="card-footer">
        <button class="ui-button">Action</button>
      </div>
    </div>
  </main>
</Layout>`,
    step4File: 'src/pages/index.astro',

    step5Title: 'Ready to Deploy',
    step5Desc: 'Build your static or SSR bundle with lightning-fast FCP.',
    step5Code: 'npm run build',
    step5File: 'Terminal'
  },

  html: {
    step1Title: 'Add CDN Stylesheet',
    step1Desc: 'Include the universal tokenized CSS in your <head>.',
    step1Code: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/nnui-kit/dist/assets/index.css">',
    step1File: 'index.html',

    step2Title: 'Add Micro-Enhancer Script',
    step2Desc: 'Include the sub-4KB runtime. Zero build step, bundler, or Node required.',
    step2Code: '<script type="module" src="https://cdn.jsdelivr.net/npm/nnui-kit/dist/assets/index.js"></script>',
    step2File: 'index.html',

    step3Title: 'Render Any Component',
    step3Desc: 'Paste the semantic HTML markup into any backend template (PHP, Blade, Django, Rails, HTMX).',
    step3Code: `<nnui-accordion type="single">
  <div data-part="item" data-value="item-1">
    <button data-part="trigger">
      <span>How does zero-build work?</span>
      <span data-part="icon">▾</span>
    </button>
    <div data-part="content">
      All components are native Web Components living directly in the Light DOM.
    </div>
  </div>
</nnui-accordion>`,
    step3File: 'index.html',

    step4Title: 'Native Form Support',
    step4Desc: 'Form controls integrate directly into standard HTML form submissions via ElementInternals.',
    step4Code: `<form action="/api/submit" method="POST">
  <nnui-select name="category" required>
    <button type="button" data-part="trigger">
      <span data-part="value">Select...</span>
      <span>▾</span>
    </button>
    <ul data-part="listbox">
      <li data-part="option" data-value="books">Books</li>
      <li data-part="option" data-value="electronics">Electronics</li>
    </ul>
  </nnui-select>
  <button type="submit" class="ui-button">Submit Form</button>
</form>`,
    step4File: 'index.html',

    step5Title: 'Enjoy Instant Paint',
    step5Desc: 'No npm install, no bundler lag. Pure platform performance.',
    step5Code: '<!-- No build command needed! Open directly in any browser. -->',
    step5File: 'Terminal'
  },

  htmx: {
    step1Title: 'Add CDN Scripts',
    step1Desc: 'Include both HTMX and NNUI-KIT from fast public CDNs in your <head>.',
    step1Code: `<!-- HTMX Core -->
<script src="https://unpkg.com/htmx.org@2.0.4"></script>

<!-- NNUI-KIT Light-DOM Universal Runtime (< 4KB) -->
<script type="module" src="https://cdn.jsdelivr.net/npm/nnui-kit/dist/index.js"></script>`,
    step1File: 'index.html',

    step2Title: 'Include Universal Stylesheet',
    step2Desc: 'Add the cascade-layered stylesheet with Shadcn Zinc token defaults.',
    step2Code: `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/nnui-kit/dist/index.css">`,
    step2File: 'index.html',

    step3Title: 'Server-Driven Toast & Notifications',
    step3Desc: 'Mount <ui-toaster> once. HTMX requests trigger toasts via standard JS or HX-Trigger headers.',
    step3Code: `<ui-toaster position="bottom-right"></ui-toaster>

<!-- HTMX Button triggering server response -->
<button data-ui="button" 
        hx-post="/api/save" 
        hx-swap="none"
        onclick="toast.success('Saving changes...')">
  Save to Cloud
</button>`,
    step3File: 'templates/dashboard.html',

    step4Title: 'Seamless Light-DOM Hypermedia Swapping',
    step4Desc: 'Because NNUI-KIT has Zero Shadow DOM, hx-swap replaces nodes cleanly without desyncing virtual trees.',
    step4Code: `<div id="card-container">
  <!-- HTMX dynamically swaps this server-rendered card -->
  <div data-ui="card">
    <div data-part="card-header">
      <h3 data-part="card-title">Live Server State</h3>
    </div>
    <div data-part="card-content">Updated via hx-get="/api/status"</div>
  </div>
</div>`,
    step4File: 'templates/dashboard.html',

    step5Title: 'Native Form Submission via ElementInternals',
    step5Desc: 'Custom form controls (<ui-select>, <ui-slider>) automatically include values in HTMX POST bodies.',
    step5Code: `<form hx-post="/api/settings" hx-target="#status">
  <ui-select name="theme" required>
    <button type="button" data-part="trigger"><span data-part="value">Choose theme...</span></button>
    <ul data-part="listbox">
      <li data-part="option" data-value="dark">Dark Theme</li>
      <li data-part="option" data-value="light">Light Theme</li>
    </ul>
  </ui-select>
  <button type="submit" data-ui="button">Apply</button>
</form>`,
    step5File: 'templates/settings.html'
  },

  django: {
    step1Title: 'Configure Base Template',
    step1Desc: 'Add the NNUI-KIT stylesheet and ES module script to templates/base.html.',
    step1Code: `{% load static %}
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <title>{% block title %}Django + NNUI{% endblock %}</title>
  <!-- NNUI-KIT CDN -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/nnui-kit/dist/index.css">
  <script type="module" src="https://cdn.jsdelivr.net/npm/nnui-kit/dist/index.js"></script>
</head>
<body>
  <ui-toaster position="bottom-right"></ui-toaster>
  {% block content %}{% endblock %}
</body>
</html>`,
    step1File: 'templates/base.html',

    step2Title: 'Bridge Django Messages to Toasts',
    step2Desc: 'Automatically convert django.contrib.messages to native toast notifications.',
    step2Code: `{% if messages %}
<script type="module">
  import { toast } from 'https://cdn.jsdelivr.net/npm/nnui-kit/dist/index.js';
  {% for message in messages %}
    toast.{{ message.tags|default:"info" }}("{{ message|escapejs }}");
  {% endfor %}
</script>
{% endif %}`,
    step2File: 'templates/base.html',

    step3Title: 'Form-Associated Custom Controls',
    step3Desc: 'Render <ui-select> and <ui-slider> with Django CSRF token. They submit cleanly in request.POST.',
    step3Code: `<form method="POST" action="{% url 'update_profile' %}">
  {% csrf_token %}
  <div data-ui="field">
    <label data-ui="label" for="role">User Role</label>
    <ui-select id="role" name="role" required>
      <button type="button" data-part="trigger"><span data-part="value">Select role...</span></button>
      <ul data-part="listbox">
        <li data-part="option" data-value="admin">Administrator</li>
        <li data-part="option" data-value="editor">Content Editor</li>
      </ul>
    </ui-select>
  </div>
  <button type="submit" data-ui="button">Save Profile</button>
</form>`,
    step3File: 'templates/profile.html',

    step4Title: 'Handle Cleanly in Django Views',
    step4Desc: 'Access field values directly in views.py without requiring any JSON parsing.',
    step4Code: `from django.shortcuts import render, redirect
from django.contrib import messages

def update_profile(request):
    if request.method == 'POST':
        selected_role = request.POST.get('role')  # Standard form submission!
        messages.success(request, f'Role updated to {selected_role}')
        return redirect('dashboard')
    return render(request, 'profile.html')`,
    step4File: 'myapp/views.py',

    step5Title: 'Run Your Django Server',
    step5Desc: 'Zero JavaScript compilation step required. Everything renders natively.',
    step5Code: 'python manage.py runserver',
    step5File: 'Terminal'
  },

  rails: {
    step1Title: 'Configure Layout in Rails',
    step1Desc: 'Add NNUI-KIT CDN assets to app/views/layouts/application.html.erb.',
    step1Code: `<!DOCTYPE html>
<html data-theme="dark">
  <head>
    <title>Rails + NNUI</title>
    <%= csrf_meta_tags %>
    <%= csp_meta_tag %>
    <%= stylesheet_link_tag "application" %>
    <!-- NNUI-KIT Universal Assets -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/nnui-kit/dist/index.css">
    <script type="module" src="https://cdn.jsdelivr.net/npm/nnui-kit/dist/index.js"></script>
  </head>
  <body>
    <ui-toaster position="bottom-right"></ui-toaster>
    <%= yield %>
  </body>
</html>`,
    step1File: 'app/views/layouts/application.html.erb',

    step2Title: 'Hotwire Turbo Streams + Toasts',
    step2Desc: 'Return real-time toast alerts from Turbo Stream controller actions.',
    step2Code: `<!-- app/views/posts/create.turbo_stream.erb -->
<%= turbo_stream.append "posts_list", partial: "post", locals: { post: @post } %>

<script type="module">
  import { toast } from 'https://cdn.jsdelivr.net/npm/nnui-kit/dist/index.js';
  toast.success("Post created successfully!");
</script>`,
    step2File: 'app/views/posts/create.turbo_stream.erb',

    step3Title: 'FormBuilder Helpers with Custom Elements',
    step3Desc: 'Use standard Rails form_with. ElementInternals serializes custom elements into params[:model].',
    step3Code: `<%= form_with model: @project do |form| %>
  <div data-ui="field">
    <%= form.label :priority, "Project Priority" %>
    <ui-select name="project[priority]">
      <button type="button" data-part="trigger"><span data-part="value">Choose...</span></button>
      <ul data-part="listbox">
        <li data-part="option" data-value="high">High Priority</li>
        <li data-part="option" data-value="normal">Normal</li>
      </ul>
    </ui-select>
  </div>
  <%= form.submit "Create Project", class: "ui-button" %>
<% end %>`,
    step3File: 'app/views/projects/_form.html.erb',

    step4Title: 'Top-Layer Dialogs & Sheets in Turbo Frames',
    step4Desc: 'Wrap native <ui-dialog> or <ui-sheet> inside turbo-frame for instant server-rendered modals.',
    step4Code: `<%= turbo_frame_tag "sheet_modal" do %>
  <ui-sheet side="right" open>
    <dialog open>
      <div data-part="sheet-content">
        <h3>Edit Details</h3>
        <%= render "form" %>
      </div>
    </dialog>
  </ui-sheet>
<% end %>`,
    step4File: 'app/views/projects/edit.html.erb',

    step5Title: 'Launch Rails Server',
    step5Desc: 'Ready to build hypermedia Rails apps with zero NPM bundle bloat.',
    step5Code: 'bin/dev',
    step5File: 'Terminal'
  }
};

function renderFramework(frameworkKey) {
  const data = FRAMEWORK_STEPS[frameworkKey];
  if (!data) return;

  for (let i = 1; i <= 5; i++) {
    const titleEl = document.getElementById(`step-${i}-title`);
    const descEl = document.getElementById(`step-${i}-desc`);
    const codeEl = document.getElementById(`step-${i}-code`);
    const fileEl = document.getElementById(`step-${i}-file`);

    if (titleEl) titleEl.textContent = data[`step${i}Title`] || '';
    if (descEl) descEl.textContent = data[`step${i}Desc`] || '';
    if (codeEl) codeEl.textContent = data[`step${i}Code`] || '';
    if (fileEl) fileEl.textContent = data[`step${i}File`] || '';
  }

  document.querySelectorAll('.framework-tab-item').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.framework === frameworkKey);
  });
}

function setupCopyButtons() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.copy-btn');
    if (!btn) return;

    const container = btn.closest('.code-container');
    const pre = container?.querySelector('.code-pre');
    if (!pre) return;

    const text = pre.textContent;
    navigator.clipboard.writeText(text).then(() => {
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '✓ Copied';
      btn.style.color = 'var(--ui-color-success-500)';
      btn.style.borderColor = 'var(--ui-color-success-500)';

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.color = '';
        btn.style.borderColor = '';
      }, 2000);
    });
  });
}

function setupFrameworkTabs() {
  document.querySelectorAll('.framework-tab-item').forEach((tab) => {
    tab.addEventListener('click', () => {
      renderFramework(tab.dataset.framework);
    });
  });
}

function setupThemeToggle() {
  const btn = document.getElementById('docs-theme-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    btn.textContent = next === 'dark' ? '☀️ Light' : '🌙 Dark';
  });
}

function setupScrollspy() {
  const sections = document.querySelectorAll('section[id], [id].scroll-target');
  const navItems = document.querySelectorAll('.docs-sidebar .sidebar-item[href^="#"]');
  const tocItems = document.querySelectorAll('.docs-toc .toc-link');

  function onScroll() {
    let currentId = '';
    const scrollY = window.scrollY;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navItems.forEach((item) => {
        const href = item.getAttribute('href') || '';
        item.classList.toggle('active', href === `#${currentId}`);
      });
      tocItems.forEach((item) => {
        const href = item.getAttribute('href') || '';
        item.classList.toggle('active', href === `#${currentId}`);
      });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

window.addEventListener('DOMContentLoaded', () => {
  initThemeCustomizer();
  initGlobalSearch();
  setupCopyButtons();
  setupFrameworkTabs();
  setupThemeToggle();
  setupScrollspy();
  renderFramework('nextjs');
});
