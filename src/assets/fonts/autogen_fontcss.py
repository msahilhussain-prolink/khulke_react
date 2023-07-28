import os
dirfiles = os.listdir()
cssfile = open('fonts.css', 'a+')
for i in range(2, len(dirfiles)):
    css = """
    @font-face {
        font-family: '"""+dirfiles[i].split('.')[0]+"""';
        src: url('../assets/fonts/"""+dirfiles[i]+"""');
    }\n
    """
    cssfile.write(css)
cssfile.close()
print('File generated!')