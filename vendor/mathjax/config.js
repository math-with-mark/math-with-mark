MathJax.Hub.Config({
    TeX: {
        Macros: {
            dwrt: "{\\mathrm{d}}",
            integral: ["{\\int {#1}\,\\dwrt{#2}", 2]
        }
    }
});

MathJax.Ajax.loadComplete("https://mark-wiemer.github.io/vendor/mathjax/config.js");
