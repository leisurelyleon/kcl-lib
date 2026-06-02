use std::net::SocketAddr;

use axum::{
    extract::Json,
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Router,
};
use kcl_diff_core::diff;
use serde::Deserialize;
use tower_http::cors::CorsLayer;

#[derive(Deserialize)]
struct DiffRequest {
    old: String,
    new: String,
}

async fn health() -> &'static str {
    "ok"
}

async fn diff_handler(Json(req): Json<DiffRequest>) -> impl IntoResponse {
    match diff(&req.old, &req.new) {
        Ok(report) => (StatusCode::OK, Json(report)).into_response(),
        Err(e) => (
            StatusCode::UNPROCESSABLE_ENTITY,
            Json(serde_json::json!({ "error": e.to_string() })),
        )
            .into_response(),
    }
}

#[tokio::main]
async fn main() {
    // Permissive CORS for the demo; tighten to the Vercel origin for production.
    let app = Router::new()
        .route("/health", get(health))
        .route("/diff", post(diff_handler))
        .layer(CorsLayer::permissive());

    let port: u16 = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(8080);
    let addr = SocketAddr::from(([0, 0, 0, 0], port));

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    println!("kcl-diff-server listening on http://{addr}");
    axum::serve(listener, app).await.unwrap();
}
