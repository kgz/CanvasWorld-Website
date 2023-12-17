use std::thread;

use actix_cors::Cors;

use actix_files::{self as fs, NamedFile};
use actix_web::{http, web, App, HttpRequest, HttpServer, Result};
use serde::{Deserialize, Serialize};


#[derive(PartialEq)]
pub enum Environments {
    DEV,
    TEST,
    PROD,
}

pub struct Env<'a> {
    pub env: Environments,
    pub auto_login_id: &'a str,
}

pub const APP_ENV: Env = Env {
    env: Environments::DEV,
    auto_login_id: "1",
};


async fn index(_: HttpRequest) -> Result<fs::NamedFile> {
    Ok(NamedFile::open("static/index.html")? )
}

async fn static_media(req: HttpRequest) -> Result<fs::NamedFile> {
    let file = req.match_info().get("file").unwrap();
    let path = format!("static/media/{}", file);
    Ok(NamedFile::open(path)?)
}

async fn test(_: HttpRequest) -> Result<String> {

    Ok("test".to_string())
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // print cwd()
    println!("cwd: {:?}", std::env::current_dir().unwrap());

    let server = HttpServer::new(|| {
        let cors = Cors::default()
            .allowed_origin("https://localhost")
            .allowed_origin_fn(|origin, _req_head| origin.as_bytes().ends_with(b".rust-lang.org"))
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
            .allowed_header(http::header::CONTENT_TYPE)
            .max_age(3600);

        App::new()
            .wrap(cors)
            .route("/", web::get().to(index))
            .route("/{tail:.*}", web::get().to(index))
    }).bind("0.0.0.0:5050")?;

    // print server url
    println!("Server running at http://localhost:5050/");
    server.run().await
}
