import pandas as pd
data_true = pd.read_csv('data/True.csv')
data_fake = pd.read_csv('data/Fake.csv')

#Noticias reales
print(data_true.head())
print(data_true.info())

#Noticias falsas
print(data_fake.head())
print(data_fake.info())

#Etiquetar data real y falsa
data_true['label'] = 1
data_fake['label'] = 0

print(data_true.head())
print(data_fake.head())

#Eliminar tittle, subject y date
data_true = data_true.drop(['title', 'subject', 'date'], axis=1)
data_fake = data_fake.drop(['title', 'subject', 'date'], axis=1)

#Combinar datasets
data = pd.concat([data_true, data_fake], ignore_index=True)
print(data.head())
data.to_csv('data/news_dataset.zip', index=False, compression={'method': 'zip', 'archive_name': 'news_dataset.csv'})