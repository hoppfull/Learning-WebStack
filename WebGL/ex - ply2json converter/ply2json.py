# This script takes a filename as argument, e.g "python ply2json.py filetobeconverted"
# without the filetype (i.e without the ".ply"). The model has to be triangulated
# before export and will only be supported with one uv map. Metadata generation is not
# automatic but hardcoded for now. Maybe not even needed in the end.

## You must include a uvmap in order for this to work!!!
import sys

# Meta data:
rowSize = "8" # Number of elements in row
rowDist = "[3, 3, 2]" # Distribution of data
# Model data:
vdata = [] # Vertex data
idata = [] # Index data

# Read .ply file to be converted into .json with my model format:
with open(sys.argv[1] + ".ply", 'r') as inFile:
	
	start_read = False # Change to True when passed header
	
	for line in inFile:
		if line.startswith("end_header"):
			start_read = True
			continue
		
		if start_read:
			if len(line) > 70: # Lines containing vertex data are atleast 72 characters long
				vdata.append( line[:-1].replace(' ', ', ') )
			
			else: # Lines containing 3 indices are 8 characters long
				idata.append( line[2:-1].replace(' ', ', ') )
		
del inFile

def get_data(data):
	temp_ = '\n\t\t' + data[0]
	for line in data[1:]:
		temp_ += ',\n\t\t' + line
	
	return temp_

# Write .json file with my model format:
with open(sys.argv[1] + ".json", 'w', encoding="utf8", newline="\n") as outFile:
	outFile.write(
	'''{
	"rowSize" : %(rowSize)s,
	"rowDist" : %(rowDist)s,
	"vdata" : [%(vdata)s
	],
	"idata" : [%(idata)s
	]\n}''' % {
		'rowSize' : rowSize,
		'rowDist' : rowDist,
		'vdata' : get_data(vdata),
		'idata' : get_data(idata)
	})

del outFile

