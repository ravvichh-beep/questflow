#!/bin/bash
# QuestFlow batch image generation via MuAPI nano-banana-2
# Формат строки задания: outpath|aspect|prompt
# ВАЖНО: в prompt не использовать двойные кавычки и обратный слэш
KEY="98d66e5718bafeaa76d333531228feddc409ddf6f1df3724ebc13507e07226b1"
EP="https://api.muapi.ai/api/v1/nano-banana-2"
STYLE=", painterly oil painting concept art, The Witcher 3 and Dark Souls atmosphere, dramatic chiaroscuro lighting, warm candlelight, rich warm browns deep blacks and amber gold highlights, ultra detailed masterpiece, no text, no UI elements, cinematic"

JOBS_FILE="$1"
[ -z "$JOBS_FILE" ] && { echo "usage: batch-gen.sh jobs.txt"; exit 1; }

declare -A RID_MAP
# 1) Запуск всех генераций
while IFS='|' read -r OUT AR PROMPT; do
  [ -z "$OUT" ] && continue
  FULL="${PROMPT}${STYLE}"
  RESP=$(curl -s -X POST "$EP" -H "x-api-key: $KEY" -H "Content-Type: application/json" \
    -d "{\"prompt\":\"${FULL}\",\"aspect_ratio\":\"${AR}\",\"resolution\":\"2k\",\"output_format\":\"png\"}")
  RID=$(echo "$RESP" | grep -oE '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}' | head -1)
  if [ -n "$RID" ]; then
    RID_MAP["$OUT"]="$RID"
    echo "QUEUED $OUT -> $RID"
  else
    echo "FAIL-START $OUT: $RESP"
  fi
done < "$JOBS_FILE"

# 2) Поллинг всех
echo "--- polling ---"
for round in $(seq 1 50); do
  ALLDONE=1
  for OUT in "${!RID_MAP[@]}"; do
    RID="${RID_MAP[$OUT]}"
    [ "$RID" = "DONE" ] && continue
    R=$(curl -s "https://api.muapi.ai/api/v1/predictions/$RID/result" -H "x-api-key: $KEY")
    if echo "$R" | grep -qE '"status":"completed"'; then
      URL=$(echo "$R" | grep -oE 'https://cdn\.muapi\.ai/outputs/[^"]+' | head -1)
      curl -s "$URL" -o "$OUT"
      echo "DONE $OUT ($(wc -c < "$OUT") bytes)"
      RID_MAP["$OUT"]="DONE"
    elif echo "$R" | grep -qE '"status":"(failed|error)"'; then
      echo "FAIL $OUT: $(echo "$R" | head -c 200)"
      RID_MAP["$OUT"]="DONE"
    else
      ALLDONE=0
    fi
  done
  [ "$ALLDONE" = "1" ] && { echo "ALL COMPLETE"; break; }
  sleep 8
done
