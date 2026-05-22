#!/bin/bash
# QuestFlow — генератор изображений через MuAPI nano-banana-2
# Использование: ./gen-image.sh "<prompt>" "<output-path>" [aspect_ratio] [resolution]
#   aspect_ratio: 16:9 (по умолч), 1:1, 9:16, 4:3, 3:2
#   resolution:   2k (по умолч), 1k, 4k

KEY="98d66e5718bafeaa76d333531228feddc409ddf6f1df3724ebc13507e07226b1"
PROMPT="$1"
OUT="$2"
AR="${3:-16:9}"
RES="${4:-2k}"

if [ -z "$PROMPT" ] || [ -z "$OUT" ]; then
  echo "usage: gen-image.sh \"<prompt>\" \"<output-path>\" [aspect] [res]"
  exit 1
fi

# Запуск генерации
RESP=$(curl -s -X POST "https://api.muapi.ai/api/v1/nano-banana-2" \
  -H "x-api-key: $KEY" -H "Content-Type: application/json" \
  -d "{\"prompt\":$(printf '%s' "$PROMPT" | python -c 'import json,sys; print(json.dumps(sys.stdin.read()))'),\"aspect_ratio\":\"$AR\",\"resolution\":\"$RES\",\"output_format\":\"png\"}")

RID=$(echo "$RESP" | grep -oE '"request_id": *"[^"]+"' | grep -oE '[a-f0-9-]{36}')
if [ -z "$RID" ]; then
  echo "FAIL: $RESP"
  exit 1
fi
echo "request_id: $RID"

# Поллинг результата
for i in $(seq 1 40); do
  R=$(curl -s "https://api.muapi.ai/api/v1/predictions/$RID/result" -H "x-api-key: $KEY")
  if echo "$R" | grep -qE '"status":"completed"'; then
    URL=$(echo "$R" | grep -oE 'https://cdn\.muapi\.ai/outputs/[^"]+' | head -1)
    curl -s "$URL" -o "$OUT"
    echo "OK: $OUT ($(wc -c < "$OUT") bytes)"
    exit 0
  fi
  if echo "$R" | grep -qE '"status":"(failed|error)"'; then
    echo "FAIL: $R"
    exit 1
  fi
  sleep 8
done
echo "TIMEOUT after polling"
exit 1
