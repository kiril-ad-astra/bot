# En tu terminal, dentro de la carpeta sophie-mvp

# Inicializar git
git init

# Crear .gitignore
echo "node_modules/" > .gitignore
echo ".next/" >> .gitignore
echo "dist/" >> .gitignore

# Agregar archivos
git add .

# Commit
git commit -m "Initial Sophie MVP"

# Crear repo en GitHub (sin README, sin .gitignore)
# Luego conectar:
git remote add origin https://github.com/TU_USUARIO/sophie-mvp.git
git push -u origin main
