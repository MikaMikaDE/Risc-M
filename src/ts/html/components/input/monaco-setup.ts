import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

(window as any).MonacoEnvironment = {
  getWorker(_: any, _label: string) {
    return new editorWorker();
  },
};
