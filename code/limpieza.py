import spacy
import numpy as np
import pandas as pd
nlp = spacy.load("en_core_web_sm",disable=["ner", "parser"])

def limpieza(textos):
    resultados = []
    # Convertir todo a minúsculas antes de procesar
    textos = [texto.lower() for texto in textos]
    # Procesar con spacy
    for doc in nlp.pipe(textos, batch_size=1000):
        #Conservar solo la lematizacion de tokens alfabéticos y no stopwords, 
        palabras = [token.lemma_ for token in doc if token.is_alpha and not token.is_stop]

        # Eliminar palabras duplicadas, manteniendo el orden
        _, idx = np.unique(palabras, return_index=True)
        texto_limpio = np.array(palabras)[np.sort(idx)].tolist()

        resultados.append(texto_limpio)
    return resultados

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
    limpiar_textos = limpieza(textos)
    print(limpiar_textos[:5])

