---
title: Socinx AI Service
emoji: 🤖
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
---

# Socinx AI Service

A FastAPI-based AI service providing text embeddings and image captioning using transformer models.

## Overview

This service exposes REST APIs for:
- **Text Embeddings** using Sentence Transformers
- **Image Captioning** using BLIP

It is deployed as a Hugging Face Space and auto-updated from GitHub.

## Features

- 🚀 FastAPI-based inference service
- 🤖 Supports CPU and GPU Spaces
- 🔄 Models loaded once at startup
- 🌐 Clean REST endpoints for downstream services

## API Endpoints

### Health Check
- **GET /**  
  Returns service status

### Text Embeddings
- **POST /embed/text**
  - Input: string or list of strings
  - Output: 768-dim embeddings
  - Model: `sentence-transformers/all-mpnet-base-v2`

### Image Captioning
- **POST /caption/image**
  - Input: image URL
  - Output: generated caption
  - Model: `Salesforce/blip-image-captioning-base`

## Models Used

- **Text Embeddings**: `all-mpnet-base-v2`
- **Image Captioning**: BLIP (Base)

Models are downloaded automatically on first startup and cached by Hugging Face.

## Notes

- First startup may take time due to model downloads
- GPU acceleration depends on Space hardware
- This Space is intended to be consumed by backend services (not a UI)

## Support

Check logs in the Hugging Face Space dashboard if the service fails to start.
