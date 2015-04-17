mydata = read.table("SIcleanNumerical.csv", header=TRUE, sep=",")
mydata$'X'=NULL
# the scagnostics for the data
scag = scagnostics(mydata)
scagcols = colnames(scag)
headers = colnames(mydata)
metrics = rownames(scag)
# create matrices for values and types and define row and column names
valuematrix = matrix(nrow=length(headers),ncol=length(headers))
metricmatrix = matrix(nrow=length(headers),ncol=length(headers))
rownames(valuematrix) = headers
colnames(valuematrix) = headers
rownames(metricmatrix) = headers
colnames(metricmatrix) = headers
# populate matrix
for(i in 1:length(headers)){
  for(j in 1:length(headers)){
    col = paste(headers[i],headers[j],sep=' * ')
    if(col %in% scagcols){
      maxmetric = 1
      for(metric in 1:length(metrics)){
        #print(scag[metric, col])
        if(scag[metric,col]>=scag[maxmetric,col]){
          maxmetric = metric
        } 
      }
      if(scag[maxmetric,col]>1){
        scag[maxmetric,col] = 1
      }
      valuematrix[i,j] = scag[maxmetric,col]
      valuematrix[j,i] = scag[maxmetric,col]
      metricmatrix[i,j] = metrics[maxmetric]
      metricmatrix[j,i] = metrics[maxmetric]
    }
  }
}

for(i in 1:length(headers)){
  valuematrix[i,i] = 1
  metricmatrix[i,i] = 'Monotonic'
}

write.csv(valuematrix, file = 'valuematrix.csv')
write.csv(metricmatrix, file = 'metricmatrix.csv')
