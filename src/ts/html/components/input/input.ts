export const inputKeydown = (input:HTMLTextAreaElement, e:KeyboardEvent) => {
  switch(e.key) {
    /*Allow for real tabs in the code editor*/
    case "Tab": {
      e.preventDefault();
      const start          = input.selectionStart;
      const end            = input.selectionEnd;
      input.value          = input.value.substring(0, start) + "\t" + input.value.substring(end);
      input.selectionStart = input.selectionEnd = start + 1;
      return;
    }
  }
};
