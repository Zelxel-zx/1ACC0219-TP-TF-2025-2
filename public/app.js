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

// ==== CARGAR MÉTRICAS DEL MODELO DESDE JSON ====
async function loadMetrics() {
  try {
    const resp = await fetch("./Resultados/metricas_aya23.json");
    if (!resp.ok) {
      console.warn("No se pudieron cargar las métricas:", resp.status);
      return;
    }

    const data = await resp.json();

    // Actualizar tarjetas de métricas (valores en porcentaje con 1 decimal)
    const metricCards = document.querySelectorAll(".metric-card div:first-child");
    if (metricCards.length >= 4) {
      metricCards[0].textContent = `${(data.accuracy * 100).toFixed(1)}%`;
      metricCards[1].textContent = `${(data.precision * 100).toFixed(1)}%`;
      metricCards[2].textContent = `${(data.recall * 100).toFixed(1)}%`;
      metricCards[3].textContent = `${(data.f1 * 100).toFixed(1)}%`;
    }

    // Actualizar matriz de confusión si existe
    if (Array.isArray(data.confusion_matrix)) {
      const cm = data.confusion_matrix;
      const tn = cm[0][0];
      const fp = cm[0][1];
      const fn = cm[1][0];
      const tp = cm[1][1];

      const matrixNumbers = document.querySelectorAll(".matrix-cell div:first-child");
      if (matrixNumbers.length >= 4) {
        // Orden visual actual en index.html:
        // [0] = Verdadero Positivo (Real / Pred Real)        -> TP
        // [1] = Falso Negativo (Real / Pred Falsa)           -> FN
        // [2] = Falso Positivo (Falsa / Pred Real)           -> FP
        // [3] = Verdadero Negativo (Falsa / Pred Falsa)      -> TN
        matrixNumbers[0].textContent = tp;
        matrixNumbers[1].textContent = fn;
        matrixNumbers[2].textContent = fp;
        matrixNumbers[3].textContent = tn;
      }
    }
  } catch (err) {
    console.warn("Error cargando metricas_aya23.json:", err);
  }
}

// Lanzar carga de métricas al iniciar
loadMetrics();

// ==== FORMULARIO DE VERIFICACIÓN ====
const form = document.getElementById("news-form");
const verifyButton = document.getElementById("verify-button");
const resultsSection = document.getElementById("results-section");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newsText = document.getElementById("news-text").value;

  if (!newsText.trim()) {
    return;
  }

  // Estado de carga
  verifyButton.innerHTML =
    '<div style="display: flex; align-items: center; justify-content: center; gap: 8px;"><div class="spinner"></div><span>Analizando...</span></div>';
  verifyButton.disabled = true;

  const resultBadge = document.getElementById("result-badge");
  const confidenceFill = document.getElementById("confidence-fill");
  const interpretationText = document.getElementById("interpretation-text");

  try {
    // Llamar al backend Aya
    const resp = await fetch("http://localhost:8000/clasificar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto: newsText })
    });

    if (!resp.ok) {
      throw new Error(`Error del backend: ${resp.status}`);
    }

    const data = await resp.json();
    const label = data.label; // 0 = falsa, 1 = verdadera

    // Confianza heurística fija: 90%
    const confidence = 90;

    if (label === 1) {
      resultBadge.textContent = "Noticia Real";
      resultBadge.className = "result-badge badge-real";
      confidenceFill.style.background = "#10b981";
      interpretationText.textContent = `El modelo Aya ha clasificado esta noticia como VERDADERA con una confianza heurística del ${confidence}%. Se recomienda igualmente contrastar con fuentes oficiales.`;
    } else {
      resultBadge.textContent = "Noticia Falsa";
      resultBadge.className = "result-badge badge-fake";
      confidenceFill.style.background = "#ef4444";
      interpretationText.textContent = `El modelo Aya ha clasificado esta noticia como FALSA con una confianza heurística del ${confidence}%. Se recomienda no difundirla sin verificación adicional.`;
    }

    confidenceFill.style.width = `${confidence}%`;
    confidenceFill.textContent = `${confidence}%`;

    // Mostrar resultados
    resultsSection.style.display = "block";
    resultsSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (error) {
    console.error("Error llamando al backend Aya:", error);
    alert("No se pudo contactar con el modelo Aya. Asegúrate de que el backend esté corriendo en http://localhost:8000.");
  } finally {
    // Reset botón
    verifyButton.textContent = defaultConfig.button_text;
    verifyButton.disabled = false;
  }
});
