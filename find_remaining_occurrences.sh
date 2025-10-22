#!/bin/bash
echo "🔍 Recherche des occurrences restantes de addToCartAndTrack et floatingCart..."

FILE="index.html"

echo "1. Occurrences de addToCartAndTrack :"
echo "-------------------------------------"
grep -n "addToCartAndTrack" "$FILE"

echo ""
echo "2. Occurrences de floatingCart :"
echo "--------------------------------"
grep -n "floatingCart" "$FILE"

echo ""
echo "3. Contexte autour de ces occurrences :"
echo "--------------------------------------"
grep -A 2 -B 2 "addToCartAndTrack" "$FILE"
