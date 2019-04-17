import dataset
db = dataset.connect('sqlite:///db.db')
from datetime import datetime


table = db['users']
table.insert(dict(ip='192.168.0.4', time=datetime.now(), path = "/"))