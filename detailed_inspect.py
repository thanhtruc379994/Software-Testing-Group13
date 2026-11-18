import pptx

prs = pptx.Presentation(r'E:\Xanh Trắng Hiện Đại Báo Cáo Công Việc Bài Thuyết Trình (1).pptx')
for idx, slide in enumerate(prs.slides):
    print(f'=== SLIDE {idx+1} ===')
    for s_idx, shape in enumerate(slide.shapes):
        if shape.has_text_frame:
            for p_idx, p in enumerate(shape.text_frame.paragraphs):
                p_text = p.text
                if not p_text.strip(): continue
                runs = p.runs
                run_details = []
                for r in runs:
                    col = 'None'
                    try:
                        col = str(r.font.color.rgb)
                    except Exception:
                        pass
                    run_details.append(f'[{r.text} | sz={r.font.size} b={r.font.bold} col={col}]')
                print(f'S{idx+1} Sh{s_idx} ({shape.name}) P{p_idx}: ' + ' '.join(run_details))
