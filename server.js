const express = require('express');
const path = require('path');
const { renderHtmlView } = require('./lib/renderHtmlView');
const { injectByTag } = require('./lib/injectByTag');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from /public
app.use('/public', express.static(path.join(__dirname, 'public')));

// Root route - render full view (home.html)
app.get('/', async (req, res) => {
    try {
      const baseViewPath = path.join('views', 'home.html');
      const partialHtml = await injectByTag(
        baseViewPath,
        { partial: await injectByTag(path.join('views', 'partials', 'example.html')) }
      );
      const html = await renderHtmlView('layout', { view: partialHtml });
      res.send(html);
    } catch (err) {
      res.status(500).send(`<pre>${err.message}</pre>`);
    }
  });

app.listen(PORT, () => {
  console.log(`MFW test server running at http://localhost:${PORT}`);
});