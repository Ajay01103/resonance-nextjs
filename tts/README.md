# Chatterbox TTS on Modal

This folder contains a Modal app that runs Chatterbox TTS with voice prompts stored in Supabase S3-compatible storage.

The app supports:

- local test runs via `modal run`
- an HTTP `/generate` endpoint (FastAPI) protected by `x-api-key`
- voice prompt lookup from S3 key path (for example `voices/system/<voice-id>`)

## 1. Prerequisites

- Python environment with `modal` CLI installed
- Modal account and CLI login
- Supabase S3 access key and secret key
- Hugging Face token (for model download)

From this folder, install dependencies:

```powershell
uv add -r requirements.txt
```

Login to Modal:

```powershell
modal token new
```

## 2. Create Modal Secrets

Create these secrets in Modal dashboard or CLI.

### `supabase-s3`

Required keys:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `S3_BUCKET_NAME`
- `S3_ENDPOINT_URL`

Example values:

- `AWS_REGION=ap-northeast-2`
- `S3_BUCKET_NAME=resonance-tts`
- `S3_ENDPOINT_URL=https://<project-ref>.storage.supabase.co/storage/v1/s3`

CLI example:

```powershell
modal secret create supabase-s3 ^
	AWS_ACCESS_KEY_ID="<supabase-access-key>" ^
	AWS_SECRET_ACCESS_KEY="<supabase-secret-key>" ^
	AWS_REGION="ap-northeast-2" ^
	S3_BUCKET_NAME="resonance-tts" ^
	S3_ENDPOINT_URL="https://<project-ref>.storage.supabase.co/storage/v1/s3"
```

### `chatterbox-api-key`

Required key:

- `CHATTERBOX_API_KEY`

```powershell
modal secret create chatterbox-api-key CHATTERBOX_API_KEY="<your-api-key>"
```

### `hf-token`

Required key:

- `HF_TOKEN`

```powershell
modal secret create hf-token HF_TOKEN="<your-huggingface-token>"
```

## 3. Run a Local Modal Test

From the `tts` folder:

```powershell
modal run chatterbox_tts.py --prompt "Hello from chatterbox [chuckle] its a simple voice test" --voice-key "voices/system/cmmm3gt8s000b5wvmiksv5o8g"
```

By default, output is written to:

```text
C:\tmp\chatterbox-tts\output.wav
```

Override the output path:

```powershell
modal run chatterbox_tts.py --prompt "Hello" --voice-key "voices/system/<voice-id>" --output-path "C:\Users\<you>\Desktop\sample.wav"
```

## 4. Deploy API Endpoint

Deploy:

```powershell
modal deploy chatterbox_tts.py
```

After deploy, Modal prints the HTTPS endpoint for `Chatterbox.serve`.

### Test with cURL

```bash
curl -X POST "https://<your-modal-endpoint>/generate" \
	-H "Content-Type: application/json" \
	-H "x-api-key: <your-api-key>" \
	-d '{"prompt":"Hello from API","voice_key":"voices/system/<voice-id>"}' \
	--output output.wav
```

## 5. Request Parameters

`POST /generate` body:

- `prompt` (string, required)
- `voice_key` (string, required)
- `temperature` (float, default `0.8`)
- `top_p` (float, default `0.95`)
- `top_k` (int, default `1000`)
- `repetition_penalty` (float, default `1.2`)
- `norm_loudness` (bool, default `true`)

## 6. Troubleshooting

### `Voice not found at ...`

- Check that the S3 key exists exactly in bucket:
  - key format should match your `voice_key` (with extension if your object has one)

### `Invalid API key`

- Ensure header is `x-api-key`
- Confirm `CHATTERBOX_API_KEY` in secret `chatterbox-api-key`

### `S3 download failed` or signature errors

- Re-check `supabase-s3` values:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_REGION`
  - `S3_BUCKET_NAME`
  - `S3_ENDPOINT_URL`

### First run is slow

- Normal behavior: model/image download and build can take time.

## 7. Security Notes

- Keep all credentials in Modal secrets, never in source code.
- Rotate Supabase and API keys periodically.
- Do not expose the `/generate` endpoint without API key protection.
