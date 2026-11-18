import pptx

prs = pptx.Presentation(r'E:\Xanh Trắng Hiện Đại Báo Cáo Công Việc Bài Thuyết Trình (1).pptx')
s5 = prs.slides[4]
pic_shape = s5.shapes[2]
print('Shape name:', pic_shape.name)
print('Shape type:', pic_shape.shape_type)
