from PIL import Image, ImageDraw

def reposition_box(in_, out_, shift_pixels):
    
    img = Image.open(in_)
    img_width, img_height = img.size

    img = img.convert("RGBA")
    pixels = img.load()
    
    def is_color_close(pixel, target_color, margin):
        count = 0
        for i in range(3):
            if abs(pixel[i]-target_color[i])<= margin:
                count+=1
        return count==3
    
    
    white_bounds = None
    target_color = (66, 144, 181, 1)
    for x in range(img_width):
        for y in range(img_height):
            r, g, b, a = pixels[x, y]
            if is_color_close((r,g,b,a), target_color, 10): 
                if not white_bounds:
                    white_bounds = [x, y, x, y] 
                else:
                    white_bounds[0] = min(white_bounds[0], x)
                    white_bounds[1] = min(white_bounds[1], y)
                    white_bounds[2] = max(white_bounds[2], x)
                    white_bounds[3] = max(white_bounds[3], y)

    if not white_bounds:
        print("White section not found!")
        return
    x1, y1, x2, y2 = white_bounds
    white_section = img.crop((x1, y1, x2, y2))
    draw = ImageDraw.Draw(img)
    draw.rectangle([x1, y1, x2, y2], fill=(2, 13, 56, 255))
    new_x1 = max(0, x1 - shift_pixels)
    new_x2 = new_x1 + (x2 - x1)
    img.paste(white_section, (new_x1, y1, new_x2, y2), white_section)
    img.save(out_)
    print(f"Adjusted image saved to {out_}")


input_img = "input.png"  
output_img = "output.png" 

shift_pixels = 1000

reposition_box(input_img, output_img, shift_pixels)
