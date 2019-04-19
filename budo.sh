rm -rf dist && mkdir -p dist && babel src -s -D -d dist --ignore *.spec.js && cp package.json dist/ && cp manifest.yml dist/ && cp .npmrc dist/
docker build -t sc-caf-service-review .
