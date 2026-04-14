
export const addCloser = (container:HTMLDivElement)=>{
    const target = container.querySelector("p");
    if (!target || container.classList.contains("no-button")) return;
    const btn = document.createElement("button");
    btn.classList.add("toggles-hidden");
    btn.innerText = "▼";
    btn.addEventListener("click", ()=>{
      const content = container.querySelector(".content");
      if  (!content) return console.warn("failed to add button");
      content.classList.toggle("hidden");
      btn.classList.toggle("on");
    });
    target.appendChild(btn);
}
