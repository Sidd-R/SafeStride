# -*- coding: utf-8 -*-
"""Untitled13.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1UnAZB8Ld6BHWse-IQZjCUuxcEyut3bQM
"""
import sys
#import numpy as np
import matplotlib.pyplot as plt
import pandas as pd

# df1=pd.read_csv('location.csv')
# print('Entered mlmodel')
df2=pd.read_csv('sh.csv')
X = df2.iloc[:, :-1].values
y = df2.iloc[:, -1].values

# from sklearn.preprocessing import StandardScaler
# sc_X = StandardScaler()
# sc_y = StandardScaler()
# X = sc_X.fit_transform(X)
# [y] = sc_y.fit_transform([y])

from sklearn.svm import SVR
regressor = SVR(kernel = 'rbf')
regressor.fit(X, y)

# loc=input('Enter your destination: ')
# loc=loc.upper()
t=int(sys.argv[5])
# int(input('Start time: '))
et=int(sys.argv[6])
# int(input('End time: '))

# x1,x2,x3,x4,x5,yy =0,0,0,0,0,0

# for x in range(0,len(df1['lat'])):
#   if loc==df1['nm_pol'][x]:
x1=float(sys.argv[1]) #lat
x2=float(sys.argv[2]) #lon
x3=int(sys.argv[4]) #metro
x4=int(sys.argv[3]) #police
x5=20000

# x1,x2,x3,x4,x5 = 19.123111,72.8695881,1,4,20000
# t, et = 12,13
X1=[[x2,x1,x5,x4,x3,t,et]]

y_pred=regressor.predict(X1)
print(y_pred[0])
