import spacy
import matplotlib.pyplot as plt
import pandas as pd
from wordcloud import WordCloud
from collections import Counter
nlp = spacy.load("en_core_web_sm",disable=["ner", "parser"])

def limpieza(textos):
    resultados = []
    # Convertir todo a minúsculas antes de procesar
    textos = [texto.lower() for texto in textos]
    # Procesar con spacy
    for doc in nlp.pipe(textos, batch_size=1000):
        #Conservar solo la lematizacion de tokens alfabéticos y no stopwords, 
        palabras = [token.lemma_ for token in doc if token.is_alpha and not token.is_stop and len(token.lemma_) >1]
        resultados.append(palabras)
    return resultados

def word_count(limpiar_textos, labels):
    # Separar textos por label
    falsas = []
    verdaderas = []

    for palabras, label in zip(limpiar_textos, labels):
        if label == 0:
            falsas.extend(palabras)
        else:
            verdaderas.extend(palabras)

    # Contar frecuencia
    count_falsas = Counter(falsas)
    count_verdaderas = Counter(verdaderas)

    palabra_mas_falsa = count_falsas.most_common(1)[0]
    palabra_mas_verdadera = count_verdaderas.most_common(1)[0]
    return falsas, verdaderas, palabra_mas_falsa, palabra_mas_verdadera

def generar_nube(palabras, titulo):
    texto = " ".join(palabras)
    nube = WordCloud(width=800,height=400,background_color='white',collocations=False).generate(texto)
    plt.figure(figsize=(10, 5))
    plt.imshow(nube, interpolation='bilinear')
    plt.axis('off')
    plt.title(titulo, fontsize=16)
    plt.show()

if __name__ == "__main__":

    data = pd.read_csv('data/news_dataset.zip', compression='zip') 
    print(data.info()) 
    #Buscar nulos y duplicados 
    print("Nulos:\n",data.isnull().sum())
    print("Duplicados: ",data.duplicated().sum())

    #Eliminar duplicados 
    data.drop_duplicates(inplace=True) 
    print("Duplicados: ",data.duplicated().sum())

    #Procesar en chunks 
    chunk_size = 5000  # Cambia según tu RAM
    textos = list(data['text'])
    limpiar_textos = []
    
    print("Procesando textos en chunks")
    for i in range(0, len(textos), chunk_size):
        chunk = textos[i:i+chunk_size]
        limpiar_chunk = limpieza(chunk)
        limpiar_textos.extend(limpiar_chunk)
    #Aplicar limpieza
    print(limpiar_textos[:5])
    
    labels = list(data['label'])
    falsas, verdaderas, palabra_falsa, palabra_verdadera = word_count(limpiar_textos, labels)

    print(f"La palabra que más se repite en noticias falsas es: {palabra_falsa[0]} ({palabra_falsa[1]} veces)")
    print(f"La palabra que más se repite en noticias verdaderas es: {palabra_verdadera[0]} ({palabra_verdadera[1]} veces)") 
    
    generar_nube(falsas, "Nube de Palabras - Noticias Falsas")
    generar_nube(verdaderas, "Nube de Palabras - Noticias Verdaderas")