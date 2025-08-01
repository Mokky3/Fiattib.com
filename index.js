// index.js
const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const path = require("path");
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"]
    }
  }
}));

// Compression middleware
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6,
  threshold: 1024
}));

// Cache headers for static assets
app.use('/css', express.static(path.join(__dirname, 'public/css'), {
  maxAge: '1y',
  etag: true,
  lastModified: true
}));

app.use('/js', express.static(path.join(__dirname, 'public/js'), {
  maxAge: '1y',
  etag: true,
  lastModified: true
}));

app.use('/images', express.static(path.join(__dirname, 'public/images'), {
  maxAge: '30d',
  etag: true,
  lastModified: true
}));

// Serve static files with caching
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
