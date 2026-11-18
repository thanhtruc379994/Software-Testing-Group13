import pptx

prs = pptx.Presentation(r'E:\Xanh Trắng Hiện Đại Báo Cáo Công Việc Bài Thuyết Trình (1).pptx')
s5 = prs.slides[4]
s6 = prs.slides[5]

for s_num, s in [(5, s5), (6, s6)]:
    print(f'Slide {s_num}:')
    for sh in s.shapes:
        if sh.shape_type == pptx.enum.shapes.MSO_SHAPE_TYPE.PICTURE:
            img = sh.image
            print(f'  Found image: {sh.name}, content_type={img.content_type}, size={len(img.blob)} bytes')
            print(f'  Position: left={sh.left}, top={sh.top}, width={sh.width}, height={sh.height}')
