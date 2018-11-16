/** Render all LaTeX using KaTeX and these global macros */
document.addEventListener("DOMContentLoaded", function () {
    renderMathInElement(document.body, {
        macros: {
            "\\dwrt": "\\mathrm{d}",
            "\\integral": "\\int #1\\,\\dwrt{#2}"
        }
    });
});
