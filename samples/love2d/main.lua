font = love.graphics.newFont('calligro-font.fnt')

love.window.setTitle('Calligro LÖVE Sample')

function love.draw()
    love.graphics.setFont(font)
    love.graphics.setBackgroundColor(255, 255, 255)

    love.graphics.print('Hello\nCalligro', 100, 200)
end
