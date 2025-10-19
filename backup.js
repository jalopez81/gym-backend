// backup.js
const fs = require('fs-extra');
const path = require('path');

const proyecto = path.resolve(__dirname); // carpeta actual

// Generar nombre legible: backup-YYYY-MM-DD_HH-MM-SS
const now = new Date();
const pad = (n) => n.toString().padStart(2, '0');
const timestamp = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}__${pad(now.getHours())}h-${pad(now.getMinutes())}m-${pad(now.getSeconds())}s`;
const backupDir = path.resolve(__dirname, '..', `gym-backend-backup-${timestamp}`);


async function main() {
  console.log(`Creando backup en: ${backupDir}`);
  await fs.mkdirp(backupDir);

  // Copiar todo menos las carpetas/archivos que queremos excluir
  await fs.copy(proyecto, backupDir, {
    filter: (src) => {
      const basename = path.basename(src);
      if (basename === 'node_modules' || basename === 'dist') {
        return false; // excluir
      }
      return true;
    }
  });

  console.log('Backup completado ✅');
}

main().catch(console.error);
