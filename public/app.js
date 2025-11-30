const defaultConfig = {
  page_title: "Verificador de Noticias con IA",
  page_subtitle: "Analiza la veracidad de noticias con inteligencia artificial",
  input_label: "Ingresa el texto de la noticia",
  button_text: "Verificar Noticia",
  results_title: "Resultado del Análisis",
  metrics_title: "Métricas de Validación del Modelo",
  primary_color: "#667eea",
  surface_color: "#ffffff",
  text_color: "#1f2937",
  success_color: "#10b981",
  danger_color: "#ef4444",
  font_family: "system-ui, -apple-system, sans-serif",
  font_size: 16
};

async function onConfigChange(config) {
  const fontFamily = config.font_family || defaultConfig.font_family;
  const fontSize = config.font_size || defaultConfig.font_size;
  const primaryColor = config.primary_color || defaultConfig.primary_color;
  const surfaceColor = config.surface_color || defaultConfig.surface_color;
  const textColor = config.text_color || defaultConfig.text_color;

  document.body.style.fontFamily = `${fontFamily}, system-ui, -apple-system, sans-serif`;

  document.getElementById("page-title").textContent =
    config.page_title || defaultConfig.page_title;
  document.getElementById("page-title").style.fontSize = `${fontSize * 2.625}px`;

  document.getElementById("page-subtitle").textContent =
    config.page_subtitle || defaultConfig.page_subtitle;
  document.getElementById("page-subtitle").style.fontSize = `${fontSize * 1.125}px`;

  document.getElementById("input-label").textContent =
    config.input_label || defaultConfig.input_label;
  document.getElementById("input-label").style.fontSize = `${fontSize}px`;
  document.getElementById("input-label").style.color = textColor;

  const verifyButton = document.getElementById("verify-button");
  verifyButton.textContent = config.button_text || defaultConfig.button_text;
  verifyButton.style.background = primaryColor;
  verifyButton.style.fontSize = `${fontSize}px`;

  document.getElementById("results-title").textContent =
    config.results_title || defaultConfig.results_title;
  document.getElementById("results-title").style.fontSize = `${
    fontSize * 1.5
  }px`;
  document.getElementById("results-title").style.color = textColor;

  document.getElementById("metrics-title").textContent =
    config.metrics_title || defaultConfig.metrics_title;
  document.getElementById("metrics-title").style.fontSize = `${
    fontSize * 1.5
  }px`;
  document.getElementById("metrics-title").style.color = textColor;

  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.style.background = surfaceColor;
  });

  const gradientBg = document.querySelector(".gradient-bg");
  gradientBg.style.background = `linear-gradient(135deg, ${primaryColor} 0%, ${adjustColor(
    primaryColor,
    -20
  )} 100%)`;
}

function adjustColor(color, amount) {
  const num = parseInt(color.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

function mapToCapabilities(config) {
  return {
    recolorables: [
      {
        get: () => config.primary_color || defaultConfig.primary_color,
        set: (value) => {
          config.primary_color = value;
          if (window.elementSdk)
            window.elementSdk.setConfig({ primary_color: value });
        }
      },
      {
        get: () => config.surface_color || defaultConfig.surface_color,
        set: (value) => {
          config.surface_color = value;
          if (window.elementSdk)
            window.elementSdk.setConfig({ surface_color: value });
        }
      },
      {
        get: () => config.text_color || defaultConfig.text_color,
        set: (value) => {
          config.text_color = value;
          if (window.elementSdk)
            window.elementSdk.setConfig({ text_color: value });
        }
      },
      {
        get: () => config.success_color || defaultConfig.success_color,
        set: (value) => {
          config.success_color = value;
          if (window.elementSdk)
            window.elementSdk.setConfig({ success_color: value });
        }
      },
      {
        get: () => config.danger_color || defaultConfig.danger_color,
        set: (value) => {
          config.danger_color = value;
          if (window.elementSdk)
            window.elementSdk.setConfig({ danger_color: value });
        }
      }
    ],
    borderables: [],
    fontEditable: {
      get: () => config.font_family || defaultConfig.font_family,
      set: (value) => {
        config.font_family = value;
        if (window.elementSdk)
          window.elementSdk.setConfig({ font_family: value });
      }
    },
    fontSizeable: {
      get: () => config.font_size || defaultConfig.font_size,
      set: (value) => {
        config.font_size = value;
        if (window.elementSdk)
          window.elementSdk.setConfig({ font_size: value });
      }
    }
  };
}

function mapToEditPanelValues(config) {
  return new Map([
    ["page_title", config.page_title || defaultConfig.page_title],
    ["page_subtitle", config.page_subtitle || defaultConfig.page_subtitle],
    ["input_label", config.input_label || defaultConfig.input_label],
    ["button_text", config.button_text || defaultConfig.button_text],
    ["results_title", config.results_title || defaultConfig.results_title],
    ["metrics_title", config.metrics_title || defaultConfig.metrics_title]
  ]);
}

if (window.elementSdk) {
  window.elementSdk.init({
    defaultConfig,
    onConfigChange,
    mapToCapabilities,
    mapToEditPanelValues
  });
}

// Form handling
const form = document.getElementById("news-form");
const verifyButton = document.getElementById("verify-button");
const resultsSection = document.getElementById("results-section");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newsText = document.getElementById("news-text").value;

  if (!newsText.trim()) {
    return;
  }

  // Show loading state
  verifyButton.innerHTML =
    '<div style="display: flex; align-items: center; justify-content: center; gap: 8px;"><div class="spinner"></div><span>Analizando...</span></div>';
  verifyButton.disabled = true;

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate results (random for demo)
  const isReal = Math.random() > 0.5;
  const confidence = Math.floor(Math.random() * 20) + 75; // 75-95%

  // Update results
  const resultBadge = document.getElementById("result-badge");
  const confidenceFill = document.getElementById("confidence-fill");
  const interpretationText = document.getElementById("interpretation-text");

  if (isReal) {
    resultBadge.textContent = "Noticia Real";
    resultBadge.className = "result-badge badge-real";
    confidenceFill.style.background = "#10b981";
    interpretationText.textContent = `El modelo ha determinado con un ${confidence}% de confianza que esta noticia tiene características de ser verdadera. Se recomienda verificar fuentes adicionales para mayor certeza.`;
  } else {
    resultBadge.textContent = "Noticia Falsa";
    resultBadge.className = "result-badge badge-fake";
    confidenceFill.style.background = "#ef4444";
    interpretationText.textContent = `El modelo ha determinado con un ${confidence}% de confianza que esta noticia tiene características de ser falsa o desinformación. Se recomienda no compartir esta información sin verificación adicional.`;
  }

  confidenceFill.style.width = `${confidence}%`;
  confidenceFill.textContent = `${confidence}%`;

  // Show results section
  resultsSection.style.display = "block";
  resultsSection.scrollIntoView({ behavior: "smooth", block: "nearest" });

  // Reset button
  verifyButton.textContent = defaultConfig.button_text;
  verifyButton.disabled = false;
});
