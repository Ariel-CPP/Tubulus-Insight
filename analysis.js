<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Tubulus Insight – Analysis</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="style.css" />
</head>

<body>

<header class="cp-header">
  <div class="cp-header-inner">
    <div class="cp-brand">
      <div class="cp-logo-circle">TI</div>
      <div>
        <div class="cp-brand-name">Tubulus Insight</div>
        <div class="cp-brand-subtitle">Hepatopancreas Nutrition AI</div>
      </div>
    </div>

    <nav class="cp-nav">
      <a href="index.html" class="cp-nav-link">Training</a>
      <a href="analysis.html" class="cp-nav-link cp-nav-link-active">Analysis</a>
    </nav>
  </div>
</header>

<main class="cp-main">

  <section class="cp-section">
    <h2 class="cp-section-title">Image Analysis</h2>

    <div class="cp-card">

      <div class="cp-field-group">
        <label class="cp-field-label">Category</label>
        <select id="categorySelect">
          <option value="post_larva">Post Larva</option>
          <option value="juvenile">Juvenile</option>
          <option value="shrimp">Shrimp</option>
        </select>
      </div>

      <div class="cp-field-group">
        <label class="cp-field-label">Images</label>

        <div class="cp-file-row">
          <input type="file" id="imageInput" multiple accept="image/*" class="cp-file-input">
          <label for="imageInput" class="cp-btn cp-btn-outline">Choose Images</label>
          <span id="fileLabel" class="cp-file-label">No files selected</span>
        </div>
      </div>

      <div id="previewContainer" class="cp-grid-2"></div>

      <button id="analyzeBtn" class="cp-btn cp-btn-primary">
        Analyze Images
      </button>

      <div id="loading" style="display:none;">Processing...</div>

      <div id="results" class="cp-grid-2"></div>

    </div>
  </section>

</main>

<footer class="cp-footer">
  Tubulus Insight
</footer>

<!-- 🔥 WAJIB -->
<script src="https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js"></script>

<script type="module" src="analysis.js"></script>

</body>
</html>
