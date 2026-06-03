# ---- Build stage ----
FROM rust:1-bookworm AS builder
WORKDIR /build

# Copy the whole workspace (server depends on kcl-diff-core).
COPY . .

# Build only the server binary in release mode.
RUN cargo build --release -p kcl-diff-server

# ---- Runtime stage ----
FROM debian:bookworm-slim
# kcl-lib pulls in TLS/HTTP crates; ca-certificates avoids runtime surprises.
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /build/target/release/kcl-diff-server /usr/local/bin/kcl-diff-server

# Fly sets PORT; our server already reads it (defaults to 8080).
ENV PORT=8080
EXPOSE 8080
CMD ["kcl-diff-server"]
