def fnctn(x):
  return x*x

class Graph:
  def __init__(self, steps):
    self.steps = steps
    self.max = 100;
    self.title = "Steps: " + str(steps)
    self.plotX = []
    self.plotY = []
    self.fX = []
    self.fY = []
    self.wid = self.max / self.steps

    # call data function
    self.data()
    self.printToFile()

  def data(self):
    for i in range(0, self.steps + 1):
      self.plotX.append(i * self.wid)
      self.plotY.append(fnctn(i * self.wid))
    for i in range(0, self.max):
      self.fX.append(i)
      self.fY.append(fnctn(i))
  
  def areaOverUp(self):
    area = 0
    for i in range(len(self.plotY)):
      area += self.wid * self.plotY[i]
    return area

  def areaUpOver(self):
    area = 0
    for i in range(len(self.plotY)-1):
      area += self.wid * self.plotY[i+1]
    area += fnctn(self.wid * len(self.plotY)) * self.wid
    return area
    
  def printToFile(self):
    print(self.plotY)
    writeme = ""
    f = open("xSquared/" + str(self.steps) + ".txt", "w")
    for i in range(len(self.plotX)):
      writeme += str(self.plotX[i]) + ","
    writeme = removeLastComma(writeme)
    writeme += "~"
    for i in range(len(self.plotY)):
      writeme += str(self.plotY[i]) + ","
    writeme = removeLastComma(writeme)
    writeme += "~"
    for i in range(len(self.fX)):
      writeme += str(self.fX[i]) + ","
    writeme = removeLastComma(writeme)
    writeme += "~"
    for i in range(len(self.fY)):
      writeme += str(self.fY[i]) + ","
    writeme = removeLastComma(writeme)
    writeme += "~" + str(self.areaOverUp())
    writeme += "~" + str(self.areaUpOver())
    f.write(writeme)
    f.close

def updateDataFile(x):
  f = open("xSquared/filelist.txt", "a")
  f.write(str(x)+".txt~")
  f.close

def removeLastComma(writeme):
  if writeme[-1] == ",":
    return writeme[:-1]
  return writeme

def main():
  graphs = []
  f = open("xSquared/filelist.txt", "w")
  f.close

  # count by 5's till 20
  for i in range(5, 20, 5):
    graphs.append(Graph(i))
    # update data file 
    updateDataFile(i)

  # count by 10's till 100
  for i in range(20, 100, 10):
    graphs.append(Graph(i))
    updateDataFile(i)
  
  # count by 50's till 500
  for i in range(100, 501, 50):
    graphs.append(Graph(i))
    updateDataFile(i)

if __name__ == "__main__":
  main()