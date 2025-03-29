document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector("#main-content");
  function loadModule(name) {
    fetch(`modules/${name}.html`)
      .then(res => res.text())
      .then(html => {
        content.innerHTML = html;
        const script = document.createElement("script");
        script.src = `js/${name}.js`;
        document.body.appendChild(script);
      });
  }
  loadModule("dashboard");
});