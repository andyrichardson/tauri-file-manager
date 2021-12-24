#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::fs;
use std::io::{Result};
use serde::{Deserialize, Serialize};
use mime_guess::{from_path};

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![read_dir])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct DirNode {
  name: String,
  path: String,
  mime: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct FileNode {
  name: String,
  path: String,
  mime: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
enum Node {
  Dir(DirNode),
  File(FileNode)
}

#[tauri::command]
fn read_dir(path: String) -> Vec<Node> {
  let dir = fs::read_dir(path);
  let mut entries: Vec<Node> = Vec::new();

  for entry in dir.unwrap() {
    let e = entry.unwrap();
    let name = e.file_name().to_string_lossy().to_string();
    let path = e.path().display().to_string();
    let mime = from_path(e.path()).first_or_octet_stream().to_string();

    if e.file_type().unwrap().is_dir() {
      entries.push(Node::Dir(DirNode {
        name,
        path,
        mime,
      }));
      continue;
    }

    entries.push(Node::File(FileNode {
      name,
      path,
      mime,
    }));
  }

  return entries;
}

