#!/usr/bin/env bash
# Comprueba que ninguna skill de .agents/skills/ apunte a un archivo de referencia que no existe.
#
# ⚠️ Por qué existe: `npx skills add <repo>` copia SOLO los directorios de skills; el directorio
# `references/` compartido que esas skills citan NO viene en el paquete. El resultado son enlaces
# que no resuelven, y eso NO da ningún error: el agente sigue el puntero, no encuentra nada y
# continúa sin la mitad del criterio. La primera vez fueron 15 enlaces rotos en 11 skills.
#
# Uso:  bash .agents/verificar-referencias.sh
# Sale con 1 si hay alguno roto, para poder encadenarlo.

cd "$(dirname "$0")/.." || exit 2

rotas=0
total=0

for skill in .agents/skills/*/SKILL.md; do
    [ -e "$skill" ] || continue
    dir=$(dirname "$skill")
    for ref in $(grep -ohE '(\.\./)*references/[A-Za-z0-9._-]+\.md' "$skill" | sort -u); do
        total=$((total + 1))
        if [ ! -e "$dir/$ref" ]; then
            rotas=$((rotas + 1))
            echo "ROTA  $(basename "$dir")  ->  $ref"
        fi
    done
done

if [ "$rotas" -gt 0 ]; then
    echo
    echo "✗ $rotas referencia(s) rota(s) de $total. Crea el archivo que falta en .agents/references/"
    echo "  (adaptado a Zyntello, no copiado del repo upstream: sus checklists son genéricos y"
    echo "   los de test son de JavaScript)."
    exit 1
fi

echo "✓ Las $total referencias de las skills resuelven."
