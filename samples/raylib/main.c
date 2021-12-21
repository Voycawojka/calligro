#include "raylib.h"

int main(void)
{
    InitWindow(800, 600, "Calligro Raylib Sample");
    
    Font font = LoadFont("calligro-font.fnt");

    SetTargetFPS(60);

    while (!WindowShouldClose())
    {
        BeginDrawing();
            ClearBackground(WHITE);
            DrawTextEx(font, "Hello\nCalligro", (Vector2){ 100.0f, 200.0f }, (float)font.baseSize, 1, WHITE);
        EndDrawing();
    }

    UnloadFont(font);

    CloseWindow();

    return 0;
}