import pptx

prs = pptx.Presentation(r'E:\Xanh Trắng Hiện Đại Báo Cáo Công Việc Bài Thuyết Trình (1).pptx')
print(f"Slide width: {prs.slide_width}, height: {prs.slide_height}")
for idx, slide in enumerate(prs.slides):
    print(f"\n*** SLIDE {idx+1} ***")
    for s_idx, shape in enumerate(slide.shapes):
        if shape.has_text_frame:
            for p_idx, p in enumerate(shape.text_frame.paragraphs):
                if p.text.strip():
                    runs_info = [f"'{r.text}'(font={r.font.name}, sz={r.font.size}, b={r.font.bold})" for r in p.runs]
                    print(f"  Shape {s_idx} ({shape.name}) P{p_idx}: {p.text} | Runs: {runs_info}")
