// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use native_dialog::FileDialog;
use serde_json::json;
use std::{path::Path, process::Command, slice::RSplit};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn choose_file() -> String {
    let path = FileDialog::new().show_open_multiple_file();

    println!("{:?}", path);
    format!("{:?}", path.unwrap())
}

#[tauri::command]
fn encrypt(file_paths: Vec<&str>, password: &str, confirm_password: &str) -> serde_json::Value {
    // println!("FILE NAME {:?} {:?}", password, file_paths);
    if password != confirm_password {
        return json!({"error": true, "message": "Passwords do not match"});
    }

    for file in file_paths.into_iter() {
        let output = Command::new("gpg")
            .args(&["--batch", "--passphrase", password, "-c", file])
            .output();

        match output {
            Ok(message) => {
                if !message.stderr.is_empty() {
                    return json!({"error": true, "message": "An error occurred while encrypting the file (Does the file already exist?)"});
                };
            }
            Err(_) => {
                return json!({"error": true, "message": "An error occurred while encrypting the file"})
            }
        };

        // println!("Encryption successful for file: {:?}", file);
    }

    json!({"error": false, "message": "All files encrypted successfully"})
}

#[tauri::command]
fn decrypt(file_paths: Vec<&str>, password: &str) -> serde_json::Value {
    // println!("FILE NAME {:?} {:?}", password, file_paths);
    for file in file_paths.into_iter() {
        let path = file.rsplit_once(".");

        match path {
            Some((path_without_ext, _)) => {
                let output = Command::new("gpg")
                    .args(&["--batch", "--passphrase", password, "--output", path_without_ext, "--decrypt", file])
                    .output();
                println!("{:?}",output);
                match output {
                    Ok(message) => {
                        if !message.status.success(){
                            
                            return json!({"error": true, "message": "An error occurred while decrypting the file (Password is incorrect/The file already exists)"});
                        };
                    }
                    Err(_) => {
                        return json!({"error": true, "message": "An error occurred while decrypting the file"})
                    }
                };
            }
            None => {
                return json!({"error": true, "message": "An error occurred while decrypting the file"});
            }
        }
    }

    json!({"error": false, "message": "All files decrypted successfully"})
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![choose_file, encrypt, decrypt])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
