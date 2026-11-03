#!/usr/bin/env bash
set -euo pipefail

site_dir="${1:-public}"
pages=(
    "$site_dir/index.html"
    "$site_dir/products/index.html"
    "$site_dir/products/gatearwayman/index.html"
    "$site_dir/products/gatearway-mcp/index.html"
)
menu_paths=(
    "/products/"
    "/products/gatearwayman/"
    "/products/gatearway-mcp/"
)

for page in "${pages[@]}"; do
    if [[ ! -s "$page" ]]; then
        printf 'Missing generated page: %s\n' "$page" >&2
        exit 1
    fi

    if ! perl -0777 -ne '
        my ($menu) = /<ul class="?nav-menu"?>(.*?)<\/ul>/s;
        exit 1 unless defined $menu;
        for my $path (qw(/products/ /products/gatearwayman/ /products/gatearway-mcp/)) {
            exit 1 if index($menu, $path) < 0;
        }
    ' "$page"; then
        printf 'Navigation menu missing or incomplete in: %s\n' "$page" >&2
        exit 1
    fi
done

printf 'Navigation menu is present on all %d generated pages.\n' "${#pages[@]}"