import { HTML_CPU } from "./HTML_CPU";
import { BUTTON   } from "./html/HTML"; 

/**Acts as the controller for the model*/
const emulator = new HTML_CPU();
BUTTON.reset.addEventListener("click", ()=>emulator.reset     ());
BUTTON.halt .addEventListener("click", ()=>emulator.halt      ());
BUTTON.step .addEventListener("click", ()=>emulator.runOneStep());
BUTTON.slow .addEventListener("click", ()=>emulator.runSlowly ());
BUTTON.start.addEventListener("click", ()=>emulator.runQuickly());
