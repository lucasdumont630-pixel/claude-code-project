#!/usr/bin/env bash
# Monta un Short vertical 1080x1920 desde un vídeo 16:9.
# Uso: ./make_short.sh ENTRADA.mp4 [INICIO_SEG] [SALIDA.mp4]
#   INICIO_SEG = segundo del archivo donde empieza el tramo
#                (71 si es el vídeo completo; 0 si ya es el clip recortado).
set -euo pipefail
IN="$1"; START="${2:-71}"; OUT="${3:-short_epic_skin.mp4}"
DUR=34.7
DIR="$(cd "$(dirname "$0")" && pwd)"
ffmpeg -y -ss "$START" -t "$DUR" -i "$IN" -filter_complex "
[0:v]split=2[a][b];
[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:3,eq=brightness=-0.15[bg];
[b]scale=1080:-2[fg];
[bg][fg]overlay=(W-w)/2:(H-h)/2,ass='${DIR}/subs.ass'[v]" \
  -map "[v]" -map 0:a? -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -r 30 \
  -c:a aac -b:a 160k -af "loudnorm=I=-14:TP=-1.5:LRA=11" -movflags +faststart "$OUT"
echo "Listo: $OUT"
