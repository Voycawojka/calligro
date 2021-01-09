class CalligroSample extends hxd.App {
    
    override function init() {
        hxd.Res.initEmbed();

        var font: h2d.Font = hxd.Res.calligro_font.toFont();
        var tf = new h2d.Text(font);

        tf.text = "Hello\nCalligro";
        
        s2d.addChild(tf);
    }

    static function main() {
        new CalligroSample();
    }
}
