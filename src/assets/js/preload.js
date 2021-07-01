// Optimization to preload all the JavaScript modules. We don't want to server push or preload them
// too soon, as that negatively impacts the Google PageSpeed Insights score (which is odd, but true).
// Instead, we start to load them once this file loads.
let paths = window.preloadJavaScriptPaths || [],
    body = document.querySelector('body'),
    element;
paths.forEach(path => {
    element = document.createElement('link');
    element.setAttribute('rel', 'preload');
    element.setAttribute('as', 'script');
    element.setAttribute('crossorigin', 'anonymous');
    element.setAttribute('href', path);
    body.appendChild(element);
});