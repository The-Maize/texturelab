import { Color } from "@/lib/designer/color";
import { GpuDesignerNode } from "@/lib/designer/gpudesignernode";

export class Crop extends GpuDesignerNode {
	public init() {
		this.title = "Crop";

		this.addInput("image");

		this.addFloatProperty("min_x", "Min X", 0.0, 0, 1, 0.01);
		this.addFloatProperty("min_y", "Min Y", 0.0, 0, 1, 0.01);
		this.addFloatProperty("max_x", "Max X", 1.0, 0, 1, 0.01);
		this.addFloatProperty("max_y", "Max Y", 1.0, 0, 1, 0.01);

		this.addColorProperty("bg", "Background Color", new Color());

		const source = `
		
		bool is_fg(float x, float min_x, float max_x)
		{
			if (min_x <= max_x) {
				return min_x <= x && x <= max_x;
			} else {
				return x <= max_x || min_x <= x;
			}
		}

		vec4 process(vec2 uv)
		{
			if (is_fg(uv.x, prop_min_x, prop_max_x) && is_fg(uv.y, prop_min_y, prop_max_y))
			{
				return texture(image, uv);
			} else {
				return vec4(prop_bg.rgb, 1.0);
			}
		}
		`;

		this.buildShader(source);
	}
}
