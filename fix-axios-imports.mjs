// This script patches libraries with compatibility issues
import fs from 'fs';
import path from 'path';

// Fix for axios Edge compatibility warnings
const axiosUtilsPath = './node_modules/axios/lib/utils.js';
if (fs.existsSync(axiosUtilsPath)) {
  let content = fs.readFileSync(axiosUtilsPath, 'utf8');
  
  // Replace setImmediate with setTimeout
  content = content.replace(/setImmediate/g, 'setTimeout');
  
  // Replace process.nextTick with setTimeout
  content = content.replace(/process\.nextTick/g, 'setTimeout');
  
  fs.writeFileSync(axiosUtilsPath, content, 'utf8');
  console.log('✅ Patched axios utils.js for Edge compatibility');
}

// Fix for troika-three-text Unicode regex issues
const troikaPath = './node_modules/troika-three-text/dist/troika-three-text.esm.js';
if (fs.existsSync(troikaPath)) {
  let content = fs.readFileSync(troikaPath, 'utf8');
  
  // Replace problematic Unicode regex with a basic function that always returns false
  // This is a simplification but should allow builds to complete
  content = content.replace(/\/\\p\{Script=Hangul\}\/u\.test\(r\)/g, 'false');
  
  fs.writeFileSync(troikaPath, content, 'utf8');
  console.log('✅ Patched troika-three-text.esm.js for webpack compatibility');
}

console.log('📦 Library patching complete'); 