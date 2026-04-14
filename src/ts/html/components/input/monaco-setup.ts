import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

window.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    return new editorWorker();
  },
};
