import pptx

prs = pptx.Presentation(r'E:\Xanh Trắng Hiện Đại Báo Cáo Công Việc Bài Thuyết Trình (1).pptx')
for idx, slide in enumerate(prs.slides):
    print(f'=== SLIDE {idx+1} ===')
    for s_idx, shape in enumerate(slide.shapes):
        if shape.has_text_frame:
            for p_idx, p in enumerate(shape.text_frame.paragraphs):
                text = p.text
                if text.strip():
                    runs_info = []
                    for r_idx, r in enumerate(p.runs):
                        col = None
                        try:
                            col = str(r.font.color.rgb)
                        except Exception:
                            pass
                        runs_info.append(f'(r{r_idx}: \"{r.text}\", sz={r.font.size}, b={r.font.bold}, col={col}, fn={r.font.name})')
                    print(f'  Sh{s_idx} [{shape.name}] P{p_idx}: ' + ' | '.join(runs_info))
