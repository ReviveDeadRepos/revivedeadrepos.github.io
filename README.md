# revivedeadrepos.github.io
The website

# How it works
This repository contains a script that fetches data from the GitHub API to generate a list of repositories that have been inactive for a long time.

```shell
#!/bin/bash

# Requires: curl, jq
# Optionally set GITHUB_TOKEN for authenticated requests (higher rate limit)

TOKEN="${GITHUB_TOKEN:-}"
OUT="repos.json"
QUERY='stars:>100 archived:false'
PER_PAGE=10
PAGES=5

API="https://api.github.com/search/repositories"

echo "[" > "$OUT"
first=1

for ((page=1; page<=PAGES; page++)); do
  echo "Fetching page $page..."
  response=$(curl -s -H "Accept: application/vnd.github+json" \
                   ${TOKEN:+-H "Authorization: Bearer $TOKEN"} \
                   "${API}?q=$(echo $QUERY | sed 's/ /+/g')&sort=updated&order=asc&per_page=$PER_PAGE&page=$page")

  # Check if response has items
  has_items=$(echo "$response" | jq '.items != null')

  if [ "$has_items" != "true" ]; then
    echo "Error: No items found or API limit reached."
    echo "Response:"
    echo "$response"
    break
  fi

  repos=$(echo "$response" | jq -c '.items[] | {
      name: .name,
      owner: .owner.login,
      url: .html_url,
      last_updated: .pushed_at,
      description: .description
    }')

  while IFS= read -r repo; do
    if [ $first -eq 0 ]; then
      echo "," >> "$OUT"
    fi
    echo "$repo" >> "$OUT"
    first=0
  done <<< "$repos"
done

echo "]" >> "$OUT"

echo "Saved to $OUT"
```

The JSON will be auto updated and improved in the future, however.