use itertools::Itertools;
use std::path::Path;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![list_fonts])
        .invoke_handler(tauri::generate_handler![get_file_metadata])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn list_fonts() -> Vec<String> {
    font_enumeration::Collection::new()
        .unwrap()
        .all()
        .into_iter()
        .map(|f| f.family_name.clone())
        .unique()
        .collect()
}

#[tauri::command]
fn get_file_metadata(path: String) -> (String, String) {
    let path_buffer = Path::new(&path);
    let file_name = path_buffer
        .file_name()
        .and_then(|name| name.to_str())
        .unwrap_or("__unknown")
        .to_string();
    let mime_type = mime_guess::from_path(&path_buffer)
        .first_or_octet_stream()
        .to_string();

    (file_name, mime_type)
}
