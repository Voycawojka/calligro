package com.ideasalmanac.calligro.libgdx;

import com.badlogic.gdx.ApplicationAdapter;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.files.FileHandle;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;

public class CalligroSample extends ApplicationAdapter {
	SpriteBatch batch;
	BitmapFont font;
	
	@Override
	public void create () {
		batch = new SpriteBatch();

		FileHandle fnt = Gdx.files.internal("calligro-font.fnt");
		FileHandle page = Gdx.files.internal("calligro-page-0.png");
		font = new BitmapFont(fnt, page, false);
	}

	@Override
	public void render () {
		Gdx.gl.glClearColor(1, 1, 1, 1);
		Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
		batch.begin();
		font.draw(batch, "Hello\nCalligro", 20, 300);
		batch.end();
	}
	
	@Override
	public void dispose () {
		batch.dispose();
		font.dispose();
	}
}
