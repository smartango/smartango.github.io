#!/bin/bash
# Hugo Docker Build and Serve Script

set -e

HUGO_VERSION="0.111.3"
DOCKER_IMAGE="klakegg/hugo:${HUGO_VERSION}-ext-alpine"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

function build() {
    echo -e "${GREEN}Building Hugo site with Docker...${NC}"
    docker run --rm -it \
        -v "$(pwd)":/src \
        -w /src \
        ${DOCKER_IMAGE} \
        hugo --gc --minify
    
    echo -e "${GREEN}Build complete!${NC}"
    echo -e "${YELLOW}Output directory: $(pwd)/public${NC}"
    echo -e "Open ${YELLOW}public/index.html${NC} in your browser"
}

function serve() {
    echo -e "${GREEN}Starting Hugo development server with Docker...${NC}"
    echo -e "${YELLOW}Server will be available at: http://localhost:1313${NC}"
    echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
    
    docker run --rm -it \
        -v "$(pwd)":/src \
        -w /src \
        -p 1313:1313 \
        ${DOCKER_IMAGE} \
        server --bind 0.0.0.0
}

function clean() {
    echo -e "${GREEN}Cleaning build artifacts...${NC}"
    rm -rf public resources
    echo -e "${GREEN}Clean complete!${NC}"
}

function help() {
    echo "Hugo Docker Helper Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  build   - Build the Hugo site (output to ./public)"
    echo "  serve   - Start Hugo development server on http://localhost:1313"
    echo "  clean   - Remove build artifacts (public/, resources/)"
    echo "  help    - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 serve    # Start development server"
    echo "  $0 build    # Build static site"
}

# Main
case "${1:-serve}" in
    build)
        build
        ;;
    serve)
        serve
        ;;
    clean)
        clean
        ;;
    help|--help|-h)
        help
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        echo ""
        help
        exit 1
        ;;
esac
