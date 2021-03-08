import cv2
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.datasets import fetch_openml
import numpy as np
from PIL import Image
import PIL.ImageOps

X,y = fetch_openml('mnist_784', version = 1, return_X_y = True)

xTrain, xTest, yTrain, yTest = train_test_split(X, y, random_state = 9, train_size = 7500, test_size = 2500 )

xTrainScaled = xTrain / 255
xTestScaled = xTest / 255

lr = LogisticRegression(solver = 'saga', multi_class = 'multinomial')
cl = lr.fit(xTrainScaled, yTrain)

def getPrediction(image):
    img = Image.open(image)
    imgBw = img.convert('L')
    imgBwResized = imgBw.resize((28, 28), Image.ANTIALIAS) 
    # antialias smoothens the edges when the image clarity is not proper
    pixelFilter = 20
    minPixel = np.percentile(imgBwResized, pixelFilter)
    imgBwResizedInvertedScaled = np.clip(imgBwResized - minPixel, 0, 255)
    maxPixel = np.max(imgBwResized)
    imgBwResizedInvertedScaled = np.asarray(imgBwResizedInvertedScaled) / maxPixel
    testSample = np.array(imgBwResizedInvertedScaled).reshape(1, 784)
    testPredict = cl.predict(testSample)
    return testPredict[0]