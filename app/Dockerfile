# docker to build rust for linux ubuntu

FROM ubuntu:18.04

# install rust
RUN apt-get update && apt-get install -y curl
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"
RUN rustup target add x86_64-unknown-linux-musl

# install musl
RUN apt-get install -y musl-tools

# install openssl
RUN apt-get install -y pkg-config libssl-dev

# install git
RUN apt-get install -y git

# install cmake
RUN apt-get install -y cmake

# install protobuf
RUN apt-get install -y protobuf-compiler

# volumne is .
WORKDIR /root
VOLUME ["/"]

# run bash
CMD ["/bin/bash"]


