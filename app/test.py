# open image_data_as_64, eg data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXwAAACWCAYA and save as file

import base64


with open('image_data_as_64.txt') as file:
    data = file.read()

# save as image
with open('image.png', 'wb') as file:
    # replace data:image/png;base64, with empty string
    data = data.replace('data:image/png;base64,', '')
    print(base64.b64decode(data))
    