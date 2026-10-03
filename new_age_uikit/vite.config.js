import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist-docs',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        docs: resolve(__dirname, 'docs.html'),
        components: resolve(__dirname, 'components.html'),
        button: resolve(__dirname, 'components/button.html'),
        badge: resolve(__dirname, 'components/badge.html'),
        input: resolve(__dirname, 'components/input.html'),
        checkbox: resolve(__dirname, 'components/checkbox.html'),
        switch: resolve(__dirname, 'components/switch.html'),
        card: resolve(__dirname, 'components/card.html'),
        avatar: resolve(__dirname, 'components/avatar.html'),
        alert: resolve(__dirname, 'components/alert.html'),
        progress: resolve(__dirname, 'components/progress.html'),
        table: resolve(__dirname, 'components/table.html'),
        skeleton: resolve(__dirname, 'components/skeleton.html'),
        separator: resolve(__dirname, 'components/separator.html'),
        combobox: resolve(__dirname, 'components/combobox.html'),
        tabs: resolve(__dirname, 'components/tabs.html'),
        dialog: resolve(__dirname, 'components/dialog.html'),
        select: resolve(__dirname, 'components/select.html'),
        accordion: resolve(__dirname, 'components/accordion.html'),
        popover: resolve(__dirname, 'components/popover.html'),
        tooltip: resolve(__dirname, 'components/tooltip.html'),
        command: resolve(__dirname, 'components/command.html'),
        sheet: resolve(__dirname, 'components/sheet.html'),
        slider: resolve(__dirname, 'components/slider.html'),
        dropdown: resolve(__dirname, 'components/dropdown.html'),
        toast: resolve(__dirname, 'components/toast.html'),
        dataTable: resolve(__dirname, 'components/data-table.html'),
        calendar: resolve(__dirname, 'components/calendar.html'),
        datePicker: resolve(__dirname, 'components/date-picker.html'),
      },
    },
  },
});
