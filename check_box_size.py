import pptx

prs = pptx.Presentation(r'E:\Xanh Trắng Hiện Đại Báo Cáo Công Việc Bài Thuyết Trình (1).pptx')
for idx in [7, 8]:
    s = prs.slides[idx]
    print(f'=== SLIDE {idx+1} ===')
    for shape in s.shapes:
        if shape.has_text_frame:
            print(f'  {shape.name}: left={shape.left}, top={shape.top}, width={shape.width}, height={shape.height}')
