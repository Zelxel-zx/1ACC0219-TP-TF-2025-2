# CC219-TP-TF-2024-2
## 🎯 Objetivo del trabajo
El objetivo de este trabajo es aplicar técnicas de **procesamiento de lenguaje natural (NLP)** y **aprendizaje automático** para clasificar noticias como **reales** o **falsas**.  
Se busca identificar patrones lingüísticos que permitan diferenciar las noticias verdaderas de las falsas y evaluar el rendimiento de distintos modelos de clasificación.

---

## 👥 Nombre de los alumnos participantes
- **Alessandro Daniel Bravo Castillo** — U202224501  
- **Nicole Vásquez Tinco** — U202322884
- **Marco Antonio Luciano Cabrera Díaz** — U202318540
---
## 🧾 Descripción del dataset
El dataset utilizado proviene del conjunto **Fake and Real News Dataset** (Kaggle).  
Está compuesto por dos archivos principales:

- **True.csv:** Contiene noticias reales.  
- **Fake.csv:** Contiene noticias falsas.  

Cada archivo incluye las siguientes columnas:

| Columna | Descripción |
|----------|-------------|
| `title`  | Título de la noticia |
| `text`   | Cuerpo del texto de la noticia |
| `subject`| Categoría o tema de la noticia |
| `date`   | Fecha de publicación |

**Tamaño aproximado:**  
- Noticias reales: 21,417 registros  
- Noticias falsas: 23,502 registros

El origen de los datos son principalmente de medios periodísticos digitales de Estados Unidos, recolectados entre 2016 y 2017.  
Para su posterior análisis será necesario realizar el preprocesamiento y normalización, que incluiría la limpieza de carácteres especiales, eliminación de stopwords, etc. Estas tareas nos permitirán preparar los datos para su uso en modelos de clasificación supervisada y análisis de patrones lingüísticos.  
El dataset se emplea para entrenar y evaluar modelos de NLP para poder cumplir los objetivos planteados en el punto anterior (Descripción del caso de uso).

## 🧠 Conclusiones
- Las noticias falsas suelen presentar características textuales específicas, como un uso más frecuente de lenguaje sensacionalista, menor objetividad y estructuras menos formales en comparación con las noticias reales. Estos patrones, capturados por los algoritmos, permiten que el modelo establezca una frontera clara entre ambas categorías, reforzando la idea de que el análisis lingüístico es una herramienta valiosa para la verificación de información en entornos digitales.  
- La importancia de contar con datos balanceados y correctamente depurados para evitar sesgos en la predicción. Esto permitió comprender el proceso completo de la recolección y limpieza de datos hasta la evaluación de modelos, fortaleciendo las habilidades analíticas y técnicas necesarias para abordar problemas reales de desinformación.
## ⚖️ Licencia
Este proyecto está bajo la licencia **MIT**
