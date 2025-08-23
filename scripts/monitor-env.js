#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class EnvironmentMonitor {
  constructor() {
    this.envFiles = ['.env', '.env.local', '.env.production'];
    this.configFiles = ['src/lib/api.ts', 'next.config.js', 'package.json'];
    this.hashFile = '.env-hash';
  }

  // Generate hash of environment files
  generateHash() {
    let content = '';
    
    // Read environment files
    this.envFiles.forEach(file => {
      if (fs.existsSync(file)) {
        content += fs.readFileSync(file, 'utf8');
      }
    });

    // Read config files
    this.configFiles.forEach(file => {
      if (fs.existsSync(file)) {
        content += fs.readFileSync(file, 'utf8');
      }
    });

    return crypto.createHash('md5').update(content).digest('hex');
  }

  // Check if environment has changed
  hasChanged() {
    const currentHash = this.generateHash();
    const previousHash = this.getPreviousHash();
    
    if (previousHash !== currentHash) {
      this.saveHash(currentHash);
      return true;
    }
    
    return false;
  }

  // Get previous hash
  getPreviousHash() {
    if (fs.existsSync(this.hashFile)) {
      return fs.readFileSync(this.hashFile, 'utf8').trim();
    }
    return null;
  }

  // Save current hash
  saveHash(hash) {
    fs.writeFileSync(this.hashFile, hash);
  }

  // Trigger deployment
  async triggerDeployment() {
    console.log('🚀 Environment changed! Triggering deployment...');
    
    // You can integrate with GitHub API to trigger workflow
    // For now, we'll just log the change
    console.log('📝 Changes detected in environment files');
    console.log('🔧 Please run: git add . && git commit -m "env: auto-update" && git push origin main');
  }

  // Watch for changes
  watch() {
    console.log('👀 Monitoring environment files for changes...');
    
    const files = [...this.envFiles, ...this.configFiles];
    files.forEach(file => {
      if (fs.existsSync(file)) {
        fs.watchFile(file, (curr, prev) => {
          if (curr.mtime > prev.mtime) {
            console.log(`📝 ${file} changed at ${new Date().toISOString()}`);
            this.triggerDeployment();
          }
        });
      }
    });
  }
}

// CLI usage
if (require.main === module) {
  const monitor = new EnvironmentMonitor();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'check':
      if (monitor.hasChanged()) {
        console.log('✅ Environment has changed');
        process.exit(1); // Exit with error code for CI/CD
      } else {
        console.log('✅ No environment changes detected');
        process.exit(0);
      }
      break;
      
    case 'watch':
      monitor.watch();
      break;
      
    case 'trigger':
      monitor.triggerDeployment();
      break;
      
    default:
      console.log('Usage: node monitor-env.js [check|watch|trigger]');
      console.log('  check   - Check if environment has changed');
      console.log('  watch   - Watch for changes continuously');
      console.log('  trigger - Trigger deployment manually');
      process.exit(1);
  }
}

module.exports = EnvironmentMonitor;
