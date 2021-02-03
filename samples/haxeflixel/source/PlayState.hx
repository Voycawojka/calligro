package;

import flixel.FlxState;
import flixel.graphics.frames.FlxBitmapFont;
import flixel.text.FlxBitmapText;
import flixel.util.FlxColor;

class PlayState extends FlxState
{
	override public function create()
	{
		super.create();

		var font = FlxBitmapFont.fromAngelCode(AssetPaths.calligro_page_0__png, AssetPaths.calligro_font__fnt);
		var text = new FlxBitmapText(font);

		text.text = "Hello\nCalligro";
		text.screenCenter();

		this.bgColor = FlxColor.WHITE;
		add(text);
	}

	override public function update(elapsed:Float)
	{
		super.update(elapsed);
	}
}
